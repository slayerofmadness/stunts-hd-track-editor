Overview resources
==================

overview-resources.json.gz is the losslessly compressed JSON resource source. Decompress with gzip -dc vendor/overview-resources.json.gz > /tmp/overview-resources.json to inspect its scene template, ground models, panorama banks and palette. Base64 in the baseline field encodes the generated 1 MiB scene data, not an executable or captured user session. Original resource ownership is retained; see ../THIRD_PARTY_NOTICES.md. Normal builds embed this data unchanged for offline browser use. The preferred TypeScript renderer source is in playstunts/.
