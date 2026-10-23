# Moneytec

A separate Moneytec frontend within the Akshay-vriksha repository, presenting Gulshan Kohli’s existing mutual fund distribution, insurance and NRI services. Contact details and supplied credentials come from `src/data/site.ts`. No travel content.

Run `python3 -m http.server 5180 --directory moneytec/dist` from the repository root. No build or third-party JavaScript dependencies.

Publish only `moneytec/dist/` to `/moneytec/` on the GitHub Pages branch. Preserve the existing AkshayVriksha site. Do not configure the purchased custom domain until the user requests it.

Planning tools run locally. Consultation forms prepare a WhatsApp draft; they do not submit data to the website or confirm an appointment. No payments or investment transactions occur here. Credentials are displayed from supplied business information, with a link to the AMFI directory for independent lookup.
