"""bst package metadata"""

from importlib.metadata import version, PackageNotFoundError

try:
    __version__: str = version("bst")
except PackageNotFoundError:  # pragma: no cover
    __version__ = "0.0.0"

from .cli import cli  # noqa: F401

__all__ = ["cli", "__version__"]
