data "archive_file" "lambda_source" {
  type = "zip"
  source_dir = "${path.module}/../dist"
  output_path = "${path.module}/out/lambda.zip"
}

resource "aws_lambda_function" "api" {
  function_name = "${var.namespace}-3-way-spades-server"
  handler = "index.handler"
  filename = data.archive_file.lambda_source.output_path
  source_code_hash = data.archive_file.lambda_source.output_base64sha256
  role = aws_iam_role.lambda.arn
  runtime = "nodejs12.x"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api.function_name
  principal     = "apigateway.amazonaws.com"

  # The "/*/*" portion grants access from any method on any resource
  # within the API Gateway REST API.
  source_arn = "${aws_api_gateway_rest_api.api.execution_arn}/*/*"
}
