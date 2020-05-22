locals {
  buckets = [
    aws_s3_bucket.terraform_state.bucket,
    aws_s3_bucket.game_state.bucket
  ]
}

resource "aws_s3_bucket" "terraform_state" {
  bucket = "${var.namespace}-terraform-state.ocelotconsulting.com"
}

resource "aws_s3_bucket" "game_state" {
  bucket = "${var.namespace}-3-way-spades.ocelotconsulting.com"
}

resource "aws_s3_bucket_public_access_block" "common" {
  count = length(local.buckets)
  bucket = local.buckets[count.index]
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket" "site" {
  bucket = "larry-john-michael-spades"
  acl = "public-read"

  website {
    index_document = "index.html"
    routing_rules = ""
  }
}

data "aws_iam_policy_document" "site_bucket" {
  statement {
    principals {
      type = "*"
      identifiers = [
        "*"
      ]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.site.arn}/*"
    ]
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.bucket
  policy = data.aws_iam_policy_document.site_bucket.json
}
