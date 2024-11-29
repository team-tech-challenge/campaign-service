#!/bin/bash
set -euo pipefail

# Description: Script to create the infrastructure for the project
# Author: Francisco Wesley
# Created Date: 2024-11-25
# Modified:
# Version: 1.0.1
# Usage:
#   chmod + x create_struct_infra.sh
#   ./create_struct_infra.sh
# shellcheck disable=SC2034

# Variables:
NAME_MICROSERVICE=${1:-""}
NAMESPACE_MICROSERVICE=${2:-""}

input_variables() {
  while [[ -z "$NAME_MICROSERVICE" ]]; do
    read -p "Enter the microservice name : " NAME_MICROSERVICE
    [[ -z "$NAME_MICROSERVICE" ]] && echo "Microservice name cannot be empty."
  done

  while [[ -z "$NAMESPACE_MICROSERVICE" ]]; do
    read -p "Enter the namespace: " NAMESPACE_MICROSERVICE
    [[ -z "$NAMESPACE_MICROSERVICE" ]] && echo "Namespace cannot be empty."
  done

  echo ""
  echo "-----------------------------------"
  echo "Microservice name: $NAME_MICROSERVICE"
  echo "Namespace: $NAMESPACE_MICROSERVICE"
}

function directory_and_files() {
  echo "-----------------------------------"
  mkdir -p iac/modules/generic
  mkdir -p iac/app

  FILE_ARGOCD="applications.yaml"
  FILE_TF_ROOT=("main.tf" "backend.tf" "variables.tf" "locals.tf" "provider.tf" "versions.tf" "datasource.tf")
  FILE_TF_GENERIC=("main.tf" "variables.tf" "versions.tf")

  for file in "${FILE_TF_ROOT[@]}"; do
    if [[ ! -f "iac/$file" ]]; then
      touch "iac/$file"
      echo "File created: iac/$file"
    else
      echo "File already exists: iac/$file"
    fi
  done

  for file in "${FILE_TF_GENERIC[@]}"; do
    if [[ ! -f "iac/modules/generic/$file" ]]; then
      touch "iac/modules/generic/$file"
      echo "File created: iac/modules/generic/$file"
    else
      echo "File already exists: iac/modules/generic/$file"
    fi
  done

  if [[ ! -f "iac/app/$FILE_ARGOCD" ]]; then
    touch "iac/app/$FILE_ARGOCD"
    echo "File created: iac/app/$FILE_ARGOCD"
  else
    echo "File already exists: iac/app/$FILE_ARGOCD"
  fi

  echo ""
  echo "-> Set up completed successfully!"
}

function write_application() {
  cat <<EOF > "iac/app/applications.yaml"
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ${NAME_MICROSERVICE}
  namespace: argocd
  labels:
    app.kubernetes.io/name: ${NAME_MICROSERVICE}
    app.kubernetes.io/part-of: argocd
    app.kubernetes.io/managed-by: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: 'https://github.com/team-tech-challenge/tech-challenge-manifest.git'
    targetRevision: HEAD
    path: ${NAME_MICROSERVICE}/kustomize/overlays/prd
    kustomize: {}
  destination:
    server: https://kubernetes.default.svc
    namespace: apps-${NAMESPACE_MICROSERVICE}
  syncPolicy:
    retry:
      limit: 3
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
    automated:
      allowEmpty: true
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
      - ApplyOutOfSyncOnly=true
revisionHistoryLimit: 5
EOF
echo ""
echo "-> Application configuration written successfully!"
}

function create_module_generic() {
  DIRECTORY_ARGOCD="\${path.root}/iac/app/applications.yaml"
  cat <<EOF > "iac/modules/generic/main.tf"

################################################
#
#            AWS ECR REPOSITORY
#
################################################

module "aws_ecr_repository" {
  source = "git::https://github.com/team-tech-challenge/terraform-modules-remotes.git//aws_ecr_repository?ref=main"

  ecr_repository_name  = var.project_name
  image_tag_mutability = "MUTABLE"
  scan_on_push         = true
  ecr_tags = merge(
    {
      "Name" = var.project_name
    },
    var.ecr_tags
  )
  create_ecr_repository = var.create_aws_ecr_repository
}

################################################
#
#            AWS ECR POLICY
#
################################################

module "aws_ecr_repository_policy" {
  source = "git::https://github.com/team-tech-challenge/terraform-modules-remotes.git//aws_ecr_lifecycle_policy?ref=main"

  ecr_repository_name_policy      = module.aws_ecr_repository.ecr_repository_name
  create_ecr_lifecycle_repository = var.create_aws_ecr_repository

  depends_on = [
    module.aws_ecr_repository
  ]
}

################################################
#
#            ARGOCD APPLICATION
#
################################################
resource "kubectl_manifest" "argocd_application" {
  yaml_body = file("${DIRECTORY_ARGOCD}")
}
EOF

echo ""
echo "-> Generic module created successfully!"
}


function create_file_variables() {
  cat <<EOF > "iac/modules/generic/variables.tf"
  variable "ecr_tags" {
    description = "A mapping of tags to assign to the resource"
    type        = map(string)
    default = {
      ManagedBy = "Terraform"
    }
  }

  variable "create_aws_ecr_repository" {
    description = "Whether to create the ECR repository"
    type        = bool
    default     = false
  }

  variable "project_name" {
    description = "The name of the project"
    type        = string
    default     = ""
  }
EOF

echo ""
echo "-> Variables file created successfully!"
}

create_files_versions() {
  cat <<EOF | tee iac/modules/generic/versions.tf iac/versions.tf > /dev/null
terraform {
  required_version = ">= 1.0.5"
  required_providers {
    helm = {
      source  = "hashicorp/helm"
      version = ">= 2.7"
    }
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = "~> 1.11.2"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.43.0"
    }
  }
}
EOF

echo ""
echo "-> Versions file created successfully!"
}

function create_files_root_module() {
  cat <<EOF > "iac/backend.tf"
terraform {
  backend "s3" {
  }
}
EOF

cat <<EOF > "iac/locals.tf"
locals {
  tags = {
    Environment = var.workspace_environment
    Created_at  = formatdate("DD-MM-YYYY HH:mm:ss 'BRT'", timeadd(timestamp(), "-3h"))
    ManagedBy   = "Terraform"
    Service     = "Application"
    Team        = "Tech-challenge"
  }
}
EOF

cat <<EOF > "iac/provider.tf"
provider "aws" {
  region = "us-east-1"
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "kubectl" {
  apply_retry_count      = 5
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}
EOF

cat <<EOF > "iac/datasource.tf"
data "aws_eks_cluster" "cluster" {
  name = "cluster-tech-challenge"
}

data "aws_eks_cluster_auth" "cluster" {
  name = data.aws_eks_cluster.cluster.name
}
EOF

cat <<EOF > "iac/variables.tf"
variable "workspace_environment" {
  description = "The environment where the resources will be created"
  type        = string
  default     = "production"
}
EOF

cat <<EOF > "iac/main.tf"
module "application" {
  source = "./modules/generic"

  project_name              = "${NAME_MICROSERVICE}"
  create_aws_ecr_repository = true
}
EOF

echo ""
echo "-> Root module created successfully!"
}

function create_github_actions() {
  WORKFLOW_FILE=".github/workflows/deploy_apps.yml"
  ENVIRONMENT="production"

  while getopts "f:e:" opt; do
    case $opt in
      f) WORKFLOW_FILE="$OPTARG" ;;
      e) ENVIRONMENT="$OPTARG" ;;
      *) echo "Use: $0 [-f workflow_file] [-e environment]" >&2; return 1 ;;
    esac
  done

  mkdir -p "$(dirname "$WORKFLOW_FILE")"

  cat <<EOF > "$WORKFLOW_FILE"
name: 'Deploy Application'

on:
  pull_request:
    types:
      - closed
    branches:
      - main

permissions:
  contents: write
  packages: write
  actions: write

jobs:
  create-ecr:
    uses: team-tech-challenge/terraform-reusable-actions/.github/workflows/create-elastic-container-registry.yml@main
    secrets:
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_REGION: \${{ secrets.AWS_REGION }}
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_SESSION_TOKEN: \${{ secrets.AWS_SESSION_TOKEN }}
      ECR_REPOSITORY: \${{ secrets.ECR_REPOSITORY }}
      WORKING_DIRECTORY: \${{ secrets.WORKING_DIRECTORY }}
      TF_BACKEND_KEY: \${{ secrets.TF_BACKEND_KEY }}
      TF_BACKEND_REGION: \${{ secrets.TF_BACKEND_REGION }}
      TF_BACKEND_BUCKET: \${{ secrets.TF_BACKEND_BUCKET }}

  build-push:
    needs: create-ecr
    uses: team-tech-challenge/terraform-reusable-actions/.github/workflows/build-image-and-push.yml@main
    secrets:
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SESSION_TOKEN: \${{ secrets.AWS_SESSION_TOKEN }}
      AWS_REGION: \${{ secrets.AWS_REGION }}
      ECR_REPOSITORY: \${{ secrets.ECR_REPOSITORY }}

  apps-argocd:
    needs: build-push
    uses: team-tech-challenge/terraform-reusable-actions/.github/workflows/create-argocd-app.yml@main
    with:
      environment: '$ENVIRONMENT'
    secrets:
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_REGION: \${{ secrets.AWS_REGION }}
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_SESSION_TOKEN: \${{ secrets.AWS_SESSION_TOKEN }}
      WORKING_DIRECTORY: \${{ secrets.WORKING_DIRECTORY }}
      TF_BACKEND_KEY: \${{ secrets.TF_BACKEND_KEY }}
      TF_BACKEND_REGION: \${{ secrets.TF_BACKEND_REGION }}
      TF_BACKEND_BUCKET: \${{ secrets.TF_BACKEND_BUCKET }}
      EKS_CLUSTER_NAME: \${{ secrets.EKS_CLUSTER_NAME }}

  change-tag:
    needs: apps-argocd
    uses: team-tech-challenge/terraform-reusable-actions/.github/workflows/deploy-argocd.yml@main
    with:
      destination_repo: 'team-tech-challenge/tech-challenge-manifest'
      destination_branch: 'main'
    secrets:
      AWS_SECRET_ACCESS_KEY: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
      AWS_ACCESS_KEY_ID: \${{ secrets.AWS_ACCESS_KEY_ID }}
      AWS_SESSION_TOKEN: \${{ secrets.AWS_SESSION_TOKEN }}
      AWS_REGION: \${{ secrets.AWS_REGION }}
      ECR_REPOSITORY: \${{ secrets.ECR_REPOSITORY }}
      API_TOKEN_GITHUB: \${{ secrets.API_TOKEN_GITHUB }}
EOF

  echo ""
  echo "-> Github Actions created successfully!"
}


main() {
  echo "-----------------------------------"
  echo "Starting the infrastructure creation script..."
  input_variables
  directory_and_files

  echo "-----------------------------------"
  echo "Writing application configuration..."
  write_application

  echo "-----------------------------------"
  echo "Creating generic module..."
  create_module_generic
  create_file_variables
  create_files_versions


  echo "-----------------------------------"
  echo "Creating root module..."
  create_files_root_module

  echo "-----------------------------------"
  echo "Creating Github Actions..."
  create_github_actions

  echo "-----------------------------------"
  echo "Infrastructure setup completed successfully!"
}

main