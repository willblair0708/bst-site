from typing import List, Dict


def extract_citations(text: str) -> List[Dict]:
    """Stub citation extractor. Returns a few made-up entries if it detects [1], [2]."""
    results: List[Dict] = []
    if "[1]" in text:
        results.append({
            "index": 1,
            "title": "Example Study",
            "doi": "10.1000/example",
            "url": "https://doi.org/10.1000/example",
            "snippet": "An example cited passage."
        })
    if "[2]" in text:
        results.append({
            "index": 2,
            "title": "Another Study",
            "doi": "10.1000/another",
            "url": "https://doi.org/10.1000/another",
            "snippet": "Another example cited passage."
        })
    return results


def format_markdown_with_refs(blocks: List[Dict]) -> str:
    """Render simple markdown with numeric references at the end."""
    body_parts: List[str] = []
    refs: List[Dict] = []
    for b in blocks:
        if b.get("type") == "paragraph":
            body_parts.append(b.get("text", ""))
        if b.get("type") == "citation":
            refs.append(b.get("ref", {}))
    md = "\n\n".join(body_parts)
    if refs:
        md += "\n\nReferences:\n"
        for i, r in enumerate(refs, start=1):
            md += f"[{i}] {r.get('title','Untitled')} — {r.get('doi','')}\n"
    return md


def chem_calc(smiles: str) -> Dict:
    """Dummy chemistry calculator. Returns pretend properties."""
    return {
        "smiles": smiles,
        "mw": 42.0,
        "hbd": 1,
        "hba": 1,
        "logp": 1.23,
        "note": "Stub properties for Phase 0",
    }


