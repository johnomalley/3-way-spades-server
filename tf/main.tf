terraform {
  backend "s3" {
    bucket         = "omalley-terraform-state.ocelotconsulting.com"
    key            = "3-way-spades-server/terraform.tfstate"
    dynamodb_table = "omalley-terraform-state-lock"
    region         = "us-east-2"
    encrypt        = "true"
    acl            = "bucket-owner-full-control"
  }
}

provider "aws" {
  region  = "us-east-2"
  version = ">=2.60.0"
}
