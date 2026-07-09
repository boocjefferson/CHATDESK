from rest_framework.views import exception_handler as drf_exception_handler

ERROR_CODES_BY_STATUS = {
    400: "validation_error",
    401: "authentication_error",
    403: "permission_denied",
    404: "not_found",
    405: "method_not_allowed",
    429: "throttled",
}


def api_exception_handler(exc, context):
    """
    Reshapes DRF's default error responses into the contract shape from
    claude/API_CONTRACT.md: {"error": ..., "message": ..., "details": {...}}.
    Views that already return this shape manually (e.g. LogoutView) return
    Response objects directly rather than raising, so they never pass
    through here.
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    if isinstance(data, dict) and "detail" in data and len(data) == 1:
        message = str(data["detail"])
        details = {}
    else:
        details = data if isinstance(data, dict) else {"non_field_errors": data}
        message = "Invalid request parameters." if response.status_code == 400 else "Request failed."

    response.data = {
        "error": ERROR_CODES_BY_STATUS.get(response.status_code, "error"),
        "message": message,
        "details": details,
    }
    return response
