---
id: regression-012-external-web-links-remain-valid
title: stable web citations are not treated as local file paths
stage: All
prompt: Record the external sources used for this decision.
expect:
  - allows stable http and https source URLs with descriptive titles and access context
  - distinguishes web citations from local filesystem references
  - still rejects file URI home temporary download and machine-specific absolute paths
tags: [regression, portability, research, citations]
---

# Scenario

Research uses public web sources while another input is a local downloaded file.

The web citations should remain reproducible, but the local machine path must not enter project artifacts.
