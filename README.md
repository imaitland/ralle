# RALLE - Research and Lab Labor Empowered

A static website for RALLE, the unionization effort for Johns Hopkins University research staff.

## Local Development

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Structure

```
├── index.html      # Landing page
├── platform.html   # Our issues
├── faq.html        # Frequently asked questions
├── css/            # Styles
├── js/             # Scripts
├── fonts/          # Union Gothic + Klima
├── images/         # Responsive images (sm/md/lg)
└── favicon/        # Favicons for all platforms
```

## Deployment

Pushes to `master` automatically deploy to GitHub Pages via `.github/workflows/deploy.yml`.

## Links

- [Sign the petition](http://tinyurl.com/ralle-petition)
- [Info sessions](https://forms.gle/soJMaRocy4XQvN6q7)
- [Contact](mailto:info@rallejhu.org)
- [UE Union](https://www.ueunion.org/)
