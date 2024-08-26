variable "aws_region" {
  description = "Região da aws"
  type        = string
}

variable "db_identifier" {
  description = "Identificador do banco de dados no rds"
  type        = string
}

variable "db_username" {
  description = "Nome de usuário do banco de dados"
  type        = string
}

variable "db_name" {
  description = "Nome do banco de dados"
  type        = string
}

variable "db_schema" {
  description = "Schema do banco de dados"
  type        = string
}

variable "db_synchronize" {
  description = "Indica se a aplicação irá sincronizar o modelo dos objetos com o banco"
  type        = string
}

variable "db_instance_class" {
  description = "Classe da instância do banco de dados"
  type        = string
}

variable "db_allocated_storage" {
  description = "Armazenamento (disco) que será alocado para o banco de dados"
  type        = number
}

variable "vpc_id" {
  description = "Identificador da vpc"
  type        = string
}

variable "subnet_ids" {
  description = "Identificadores da subnet"
  type        = list(string)
}
