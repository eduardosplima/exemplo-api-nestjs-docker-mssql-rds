output "rds_endpoint" {
  value = aws_db_instance.db_instance.endpoint
}

output "ecr_endpoint" {
  value = aws_ecr_repository.db_secret_ecr.repository_url
}
