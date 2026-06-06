import json
import os
import re

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

FILES = {
    "companies": os.path.join(DATA_DIR, "companies.json"),
    "patterns": os.path.join(DATA_DIR, "patterns.json"),
}


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def slugify(title):
    slug = title.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"[\s]+", "-", slug)
    return slug.strip("-")


def prompt(label, default=None):
    hint = f" [{default}]" if default is not None else ""
    val = input(f"{label}{hint}: ").strip()
    if not val and default is not None:
        return default
    return val


def read_multiline(label):
    print(f"{label} (paste below, then type END on its own line):")
    lines = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)
    return "\n".join(lines)


def choose_target():
    print("\nTarget file:")
    print("  1) companies")
    print("  2) patterns")
    print("  3) both")
    choice = input("Choose [1/2/3]: ").strip()
    if choice == "1":
        return ["companies"]
    elif choice == "3":
        return ["companies", "patterns"]
    return ["patterns"]


def choose_category(file_key):
    data = load_json(FILES[file_key])
    keys = list(data.keys())
    print(f"\nAvailable {file_key} categories:")
    for i, k in enumerate(keys, 1):
        print(f"  {i:2}. {k}")
    print()
    val = input(f"Category name (or number): ").strip()
    if val.isdigit():
        idx = int(val) - 1
        if 0 <= idx < len(keys):
            return keys[idx], data
    if val not in data:
        print(f"  '{val}' not found — will create a new category.")
        data[val] = []
    return val, data


def build_entry():
    print("\n--- Problem details ---")
    title = prompt("Title")
    default_slug = slugify(title)
    slug = prompt("Slug", default=default_slug)

    print("Difficulty: 1) EASY  2) MEDIUM  3) HARD")
    diff_choice = input("Choose [1/2/3]: ").strip()
    difficulty = {"1": "EASY", "2": "MEDIUM", "3": "HARD"}.get(diff_choice, "MEDIUM")

    default_link = f"https://leetcode.com/problems/{slug}"
    link = prompt("LeetCode link", default=default_link)
    category_tags = prompt("Category tags (e.g. Array, Hash Table)")
    description = read_multiline("Description")
    solution = read_multiline("Solution code")
    explanation = prompt("Explanation", default="N/A")
    time_complexity = prompt("Time complexity", default="O(n)")
    space_complexity = prompt("Space complexity", default="O(1)")

    return {
        "title": title,
        "difficulty": difficulty,
        "category": category_tags,
        "link": link,
        "slug": slug,
        "description": description,
        "solution": solution,
        "explanation": explanation,
        "time_complexity": time_complexity,
        "space_complexity": space_complexity,
    }


def find_duplicates(slug, datasets):
    found = []
    for file_key, (cat, data) in datasets.items():
        for category, problems in data.items():
            for p in problems:
                if p.get("slug", "").strip().lower() == slug.strip().lower():
                    found.append(f"{file_key}.json → {category}")
    return found


def confirm(entry, targets_with_categories):
    print("\n--- Summary ---")
    print(f"  Title:      {entry['title']} ({entry['difficulty']})")
    print(f"  Slug:       {entry['slug']}")
    print(f"  Link:       {entry['link']}")
    print(f"  Category:   {entry['category']}")
    print(f"  Time/Space: {entry['time_complexity']} / {entry['space_complexity']}")
    for file_key, cat in targets_with_categories:
        print(f"  Will add to: {file_key}.json → {cat}")
    answer = input("\nSave? [y/N]: ").strip().lower()
    return answer == "y"


def main():
    print("=== Add a new LeetCode problem ===")
    targets = choose_target()

    targets_with_categories = []
    datasets = {}

    for file_key in targets:
        cat, data = choose_category(file_key)
        targets_with_categories.append((file_key, cat))
        datasets[file_key] = (cat, data)

    entry = build_entry()

    dupes = find_duplicates(entry["slug"], datasets)
    if dupes:
        print(f"\n[WARNING] Slug '{entry['slug']}' already exists in:")
        for loc in dupes:
            print(f"  • {loc}")
        answer = input("Add anyway? [y/N]: ").strip().lower()
        if answer != "y":
            print("Aborted.")
            return

    if not confirm(entry, targets_with_categories):
        print("Aborted.")
        return

    for file_key, (cat, data) in datasets.items():
        data[cat].append(entry)
        save_json(FILES[file_key], data)
        print(f"[SUCCESS] Added '{entry['title']}' to {file_key}.json → {cat}")


if __name__ == "__main__":
    main()
