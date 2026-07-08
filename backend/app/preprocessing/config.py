from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

RAW_DATA = BASE_DIR / "datasets" / "raw"

PROCESSED_DATA = BASE_DIR / "datasets" / "processed"

TRAIN_DATA = BASE_DIR / "datasets" / "train"

TEST_DATA = BASE_DIR / "datasets" / "test"