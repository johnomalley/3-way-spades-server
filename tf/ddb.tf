resource "aws_dynamodb_table" "terraform_state_lock" {
  name = "${var.namespace}-terraform-state-lock"
  hash_key     = "LockID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }
}

resource "aws_dynamodb_table" "game" {
  hash_key = "id"
  name = "${var.namespace}-3-way-spades-game"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }
}
