module "campaign-service" {
  source = "./modules/generic"

  project_name              = "campaign-service"
  create_aws_ecr_repository = true
}
