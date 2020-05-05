resource "aws_api_gateway_api_key" "api" {
  name = "${var.namespace}-3-way-spades"
}

resource "aws_api_gateway_rest_api" "api" {
  name        = "${var.namespace}-3-way-spades"
  description = "Terraform Serverless Application Example"
}

resource "aws_api_gateway_usage_plan" "api" {
  name = "${var.namespace}-3-way-spades"

  api_stages {
    api_id = aws_api_gateway_rest_api.api.id
    stage  = aws_api_gateway_deployment.api.stage_name
  }
}

resource "aws_api_gateway_usage_plan_key" "api" {
  key_id        = aws_api_gateway_api_key.api.id
  key_type      = "API_KEY"
  usage_plan_id = aws_api_gateway_usage_plan.api.id
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = aws_api_gateway_rest_api.api.id
  parent_id   = aws_api_gateway_rest_api.api.root_resource_id
  path_part   = "{proxy}"
}

resource "aws_api_gateway_method" "proxy" {
  authorization    = "NONE"
  http_method      = "ANY"
  resource_id      = aws_api_gateway_resource.proxy.id
  rest_api_id      = aws_api_gateway_rest_api.api.id
  api_key_required = true
}

resource "aws_api_gateway_deployment" "api" {
  depends_on = [
    aws_api_gateway_integration.lambda
  ]
  rest_api_id = aws_api_gateway_rest_api.api.id
  stage_name  = "default"
}

resource "aws_api_gateway_integration" "lambda" {
  http_method             = aws_api_gateway_method.proxy.http_method
  resource_id             = aws_api_gateway_method.proxy.resource_id
  rest_api_id             = aws_api_gateway_rest_api.api.id
  type                    = "AWS_PROXY"
  integration_http_method = "POST"
  uri                     = aws_lambda_function.api.invoke_arn
}
