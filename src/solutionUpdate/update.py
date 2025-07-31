import json
import argparse
import os

def format_code_for_json(code: str) -> str:
    return code.strip()

def update_all_matching_slugs(jsonfile: str, slug: str, codefile: str):
    if not os.path.exists(jsonfile):
        print(f"[ERROR] JSON file '{jsonfile}' not found.")
        return

    if not os.path.exists(codefile):
        print(f"[ERROR] Code file '{codefile}' not found.")
        return

    with open(jsonfile, 'r', encoding='utf-8') as f:
        data = json.load(f)

    with open(codefile, 'r', encoding='utf-8') as f:
        raw_code = f.read()

    formatted_code = format_code_for_json(raw_code)
    updated_count = 0

    for category, problems in data.items():
        for problem in problems:
            if problem.get('slug', '').strip().lower() == slug.strip().lower():
                problem['solution'] = formatted_code
                updated_count += 1

    if updated_count == 0:
        print(f"[WARNING] No matching slug '{slug}' found.")
    else:
        with open(jsonfile, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"[SUCCESS] Updated {updated_count} occurrence(s) of '{slug}' in {jsonfile}.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Update all solutions matching a slug in grouped JSON.")
    parser.add_argument('--s', required=True, help='slug of the problem to update')
    parser.add_argument('--c', required=True, help='Path to Python file containing new solution')
    parser.add_argument('--j', required=True, nargs='+', help='Path(s) to grouped JSON file(s) to update (space-separated)')

    args = parser.parse_args()
    for jfile in args.j:
        json_file = os.path.join("..", "data", jfile)
        update_all_matching_slugs(json_file, args.s, args.c)
