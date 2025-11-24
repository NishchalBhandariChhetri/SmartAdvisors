from parse_transcript import extract_all_courses  # import from sibling file

# Path to your PDF. Adjust if your transcript PDF is in a different folder or has a different name.
pdf_path = '/Users/ilayarajamani/Desktop/Miscellaneous/km_t.pdf'  # Up two levels if running from inside server/app/scripts/

courses = extract_all_courses(pdf_path)

print("\nCompleted courses found:")
for course in courses:
    print(course)
