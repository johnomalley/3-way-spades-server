data "aws_iam_policy_document" "lambda" {
  statement {
    actions = [
      "s3:*"
    ]
    resources = [
      aws_s3_bucket.game_state.arn,
      "${aws_s3_bucket.game_state.arn}/*"
    ]
  }
}

data "aws_iam_policy_document" "assume_lambda" {
  statement {
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com"
      ]
    }
    actions = [
      "sts:AssumeRole"
    ]
  }
}

resource "aws_iam_policy" "lambda" {
  name   = "${var.namespace}-3-way-spades-api-lambda"
  policy = data.aws_iam_policy_document.lambda.json
}

resource "aws_iam_role" "lambda" {
  name               = "${var.namespace}-3-way-spades-api-lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_lambda.json
}

resource "aws_iam_role_policy_attachment" "lambda" {
  policy_arn = aws_iam_policy.lambda.arn
  role       = aws_iam_role.lambda.name
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}
