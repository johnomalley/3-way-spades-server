terraform {
  backend "s3" {
    bucket         = "omalley-terraform-state.ocelotconsulting.com"
    key            = "3-way-spades-server/terraform.tfstate"
    dynamodb_table = "omalley-tf-state-lock"
    region         = "us-east-2"
    encrypt        = "true"
    acl            = "bucket-owner-full-control"
  }
}

provider "aws" {
  region  = "us-east-2"
  version = ">=3.13.0"
}
