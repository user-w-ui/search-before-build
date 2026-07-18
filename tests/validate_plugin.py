from __future__ import annotations

import argparse

from validation import VALIDATORS
from validation.common import assert_legacy_name_removed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate search-before-build plugin contracts."
    )
    parser.add_argument(
        "contracts",
        nargs="*",
        choices=tuple(VALIDATORS),
        help="Optional contract groups to run; omit to run all.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    selected = args.contracts or list(VALIDATORS)
    assert_legacy_name_removed()
    for name in selected:
        VALIDATORS[name]()
        print(f"{name} contract: OK")
    print("search-before-build plugin structure and behavior constraints: OK")


if __name__ == "__main__":
    main()
