resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.namespace}-terraform-state.ocelotconsulting.com"
}

resource "aws_s3_bucket_public_access_block" "content" {
  bucket                  = aws_s3_bucket.terraform_state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
