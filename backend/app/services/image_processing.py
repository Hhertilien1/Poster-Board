import base64
from io import BytesIO

from PIL import Image, UnidentifiedImageError
import pypdfium2 as pdfium


ALLOWED_IMAGE_MIME_TYPES = {
    "image/png",
    "image/jpeg",
    "application/pdf",
}


def _convert_pdf_to_png(raw_pdf: bytes) -> bytes:
    """Render the first page of a PDF into PNG bytes."""
    try:
        pdf_document = pdfium.PdfDocument(raw_pdf)
    except Exception as exc:
        raise ValueError("Poster PDF could not be opened.") from exc

    if len(pdf_document) == 0:
        raise ValueError("Poster PDF has no pages.")

    page = pdf_document[0]
    bitmap = page.render(scale=2.0)
    pil_image = bitmap.to_pil()

    output_buffer = BytesIO()
    pil_image.convert("RGBA").save(output_buffer, format="PNG")
    return output_buffer.getvalue()


def normalize_image_data_url(data_url: str) -> str:
    """Convert supported input image data URLs into PNG data URLs for consistent display."""
    if not isinstance(data_url, str) or not data_url.startswith("data:"):
        raise ValueError("Poster upload must be a valid data URL.")

    header, _, payload = data_url.partition(",")
    if not payload or ";base64" not in header:
        raise ValueError("Poster upload must be a base64 encoded data URL.")

    source_mime_type = header[5:].split(";")[0].lower()
    if source_mime_type not in ALLOWED_IMAGE_MIME_TYPES:
        raise ValueError("Unsupported poster file type. Allowed types: PNG, JPEG, PDF.")

    try:
        raw = base64.b64decode(payload)
    except Exception as exc:
        raise ValueError("Poster upload contains invalid base64 data.") from exc

    if source_mime_type == "application/pdf":
        normalized_png_bytes = _convert_pdf_to_png(raw)
    else:
        try:
            image = Image.open(BytesIO(raw))
        except UnidentifiedImageError as exc:
            raise ValueError("Poster upload could not be parsed as an image.") from exc

        output_buffer = BytesIO()
        # Preserve alpha where available by using RGBA PNG output.
        image.convert("RGBA").save(output_buffer, format="PNG")
        normalized_png_bytes = output_buffer.getvalue()

    encoded_png = base64.b64encode(normalized_png_bytes).decode("ascii")
    return f"data:image/png;base64,{encoded_png}"