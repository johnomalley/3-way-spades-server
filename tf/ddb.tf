resource "aws_dynamodb_table" "state_lock" {
  name = "${var.namespace}-state-lock"
  hash_key = "LockID"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "LockID"
    type = "S"
  }
}
