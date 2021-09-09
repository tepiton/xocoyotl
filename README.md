# tepiton

[tepiton](https://nahuatl.uoregon.edu/content/tepiton): a small thing

A template for a
Drafts-based
micro-blog
kind of thing.


## files to edit

### README.md


```diff
diff --git i/README.md w/README.md
index 84dca1c..8a524cd 100644
--- i/README.md
+++ w/README.md
@@ -1,6 +1,3 @@
-# tepiton
+# tlilli

-A template for a
-Drafts-based
-micro-blog
-kind of thing.
+black ink
```

### package.json

```diff
diff --git i/package.json w/package.json
index df9e046..5bdb96c 100644
--- i/package.json
+++ w/package.json
@@ -1,5 +1,5 @@
 {
-  "name": "tepiton",
+  "name": "tlilli",
   "version": "1.0.0",
   "description": "",
   "main": "index.js",
@@ -10,7 +10,7 @@
     "debug": "DEBUG=* npx eleventy"
   },
   "keywords": [],
-  "repository": "https://github.com/pborenstein/tepiton.git",
+  "repository": "https://github.com/tepiton/tlilli.git",
   "author": "Philip Borenstein",
   "license": "MIT",
   "devDependencies": {
```


### config.json

```diff
diff --git i/src/data/config.json w/src/data/config.json
index 929720a..72e7d33 100644
--- i/src/data/config.json
+++ w/src/data/config.json
@@ -1,3 +1,3 @@
 {
-  "siteName":         "tepiton"
+  "siteName":         "tlilli"
 }
```
