# Database
resource "random_password" "db_password" {
  length           = 32
  special          = true
  override_special = "!#$%?"
}

resource "aws_db_instance" "db_instance" {
  allocated_storage               = var.db_allocated_storage
  db_subnet_group_name            = aws_db_subnet_group.db_subnet_group.name
  deletion_protection             = false
  enabled_cloudwatch_logs_exports = []
  engine                          = "sqlserver-ex"
  engine_version                  = "16.00.4131.2.v1"
  identifier                      = var.db_identifier
  instance_class                  = var.db_instance_class
  multi_az                        = false
  parameter_group_name            = "default.sqlserver-ex-16.0"
  password                        = random_password.db_password.result
  publicly_accessible             = true
  skip_final_snapshot             = true
  username                        = var.db_username
  vpc_security_group_ids          = [aws_security_group.db_segr.id]
}

resource "aws_db_subnet_group" "db_subnet_group" {
  name       = "db-subnet-group-${var.db_identifier}"
  subnet_ids = var.subnet_ids
}

resource "aws_security_group" "db_segr" {
  name        = "segr-rds-${var.db_identifier}"
  description = "Define as regras de acesso ao banco de dados ${var.db_identifier}"
  vpc_id      = var.vpc_id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_vpc_security_group_ingress_rule" "db_segr_ingress_1" {
  security_group_id = aws_security_group.db_segr.id
  description       = "SQL Server"
  from_port         = 1433
  to_port           = 1433
  ip_protocol       = "tcp"
  cidr_ipv4         = "0.0.0.0/0"
}

# Database Secret
resource "aws_secretsmanager_secret" "db_secret" {
  name                    = "secret-rds-${var.db_identifier}"
  description             = "Credenciais do rds ${var.db_identifier}"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db_secret_version" {
  secret_id = aws_secretsmanager_secret.db_secret.id
  secret_string = jsonencode({
    engine      = "sqlserver"
    host        = aws_db_instance.db_instance.address
    port        = 1433
    username    = var.db_username
    password    = random_password.db_password.result
    dbname      = var.db_name
    dbschema    = var.db_schema
    synchronize = var.db_synchronize
  })
}

# Lambda Database Secret Rotation
resource "aws_iam_role" "role_db_secret_rotation" {
  name = "role-lambda-secret-rotation-${var.db_identifier}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_policy" "policy_db_secret_rotation" {
  name = "policy-lambda-secret-rotation-${var.db_identifier}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action   = "secretsmanager:GetRandomPassword"
        Effect   = "Allow"
        Resource = "*"
      },
      {
        Action = [
          "secretsmanager:DescribeSecret",
          "secretsmanager:GetSecretValue",
          "secretsmanager:PutSecretValue",
          "secretsmanager:UpdateSecretVersionStage"
        ]
        Effect   = "Allow"
        Resource = aws_secretsmanager_secret.db_secret.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "rpa_db_secret_rotation" {
  role       = aws_iam_role.role_db_secret_rotation.name
  policy_arn = aws_iam_policy.policy_db_secret_rotation.arn
}

resource "aws_iam_role_policy_attachment" "rpa_db_secret_rotation_2" {
  role       = aws_iam_role.role_db_secret_rotation.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_ecr_repository" "db_secret_ecr" {
  name         = "ecr-lambda-secret-rotation"
  force_delete = true
}

resource "aws_lambda_function" "db_secret_rotation" {
  image_uri     = "${aws_ecr_repository.db_secret_ecr.repository_url}:latest"
  function_name = "SecretsManagerRDSMSSQLRotationSingleUser"
  role          = aws_iam_role.role_db_secret_rotation.arn
  package_type  = "Image"
  timeout       = 10

  environment {
    variables = {
      SECRETS_MANAGER_ENDPOINT = "https://secretsmanager.${var.aws_region}.amazonaws.com"
    }
  }
}

resource "aws_lambda_permission" "db_secret_rotation_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.db_secret_rotation.function_name
  principal     = "secretsmanager.amazonaws.com"
  source_arn    = aws_secretsmanager_secret.db_secret.arn
}

resource "aws_secretsmanager_secret_rotation" "db_secret_rotation" {
  depends_on          = [aws_lambda_permission.db_secret_rotation_permission]
  secret_id           = aws_secretsmanager_secret.db_secret.id
  rotation_lambda_arn = aws_lambda_function.db_secret_rotation.arn

  rotation_rules {
    automatically_after_days = 7
  }
}
