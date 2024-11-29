module "application" {
  source = "./modules/generic"

  project_name              = "campaign-service"
  create_aws_ecr_repository = true
}
