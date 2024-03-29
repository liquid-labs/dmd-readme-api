SRC:=.
DIST:=dist
QA:=qa

DRA_IGNORE_PATHS=-not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/dist/*" -not -path "*/coverage/*"

DRA_DATA_SELECTOR=\( -path "*/test/data/*"  -o -path "*/test/data-*/*" -o -path "*/test-data/*" \)

# all test data (cli and lib)
DRA_TEST_DATA_SRC:=$(shell find $(SRC) -type f $(DRA_DATA_SELECTOR) $(DRA_IGNORE_PATHS))

DRA_JS_SELECTOR=\( -name "*.js" -o -name "*.cjs" -o -name "*.mjs" -o -name "*.jsx" \)
DRA_TEST_SELECTOR=\( -name "*.test.*js" -o -path "*/test/*" \)

# all source, non-test files (cli and lib)
DRA_ALL_JS_FILES_SRC:=$(shell find $(SRC) $(DRA_JS_SELECTOR) -not $(DRA_DATA_SELECTOR) -type f $(DRA_IGNORE_PATHS))
DRA_ALL_NON_TEST_JS_FILES_SRC:=$(shell find $(SRC) -type f $(DRA_JS_SELECTOR) -not $(DRA_DATA_SELECTOR) -not $(DRA_TEST_SELECTOR) $(DRA_IGNORE_PATHS))

#####
# build rules
#####

build: # noop

#####
# test rules
#####

DRA_JEST:=npx jest
DRA_JEST_CONFIG:=$(shell npm explore @liquid-labs/sdlc-resource-jest -- pwd)/dist/jest.config.js

DRA_TEST_REPORT:=$(QA)/unit-test.txt
DRA_TEST_PASS_MARKER:=$(QA)/.unit-test.passed
DRA_COVERAGE_REPORTS:=$(QA)/coverage
TEST_TARGETS+=$(DRA_TEST_REPORT) $(DRA_TEST_PASS_MARKER) $(DRA_COVERAGE_REPORTS)
PRECIOUS_TARGETS+=$(DRA_TEST_REPORT)

$(DRA_TEST_PASS_MARKER) $(DRA_TEST_REPORT) ./coverage &: package.json $(DRA_ALL_JS_FILES_SRC) $(DRA_TEST_DATA_SRC)
	mkdir -p $(dir $@)
	echo -n 'Test git rev: ' > $(DRA_TEST_REPORT)
	git rev-parse HEAD >> $(DRA_TEST_REPORT)
	( set -e; set -o pipefail; \
	  	( \
	  		SRJ_CWD_REL_PACKAGE_DIR='.' \
		  	$(DRA_JEST) \
		    --config=$(DRA_JEST_CONFIG) \
		    --runInBand \
		    $(TEST) 2>&1 \
		  ) \
	  | tee -a $(DRA_TEST_REPORT); \
	  touch $(DRA_TEST_PASS_MARKER) )

$(DRA_COVERAGE_REPORTS): $(DRA_TEST_PASS_MARKER) ./coverage
	rm -rf $(DRA_COVERAGE_REPORTS)
	mkdir -p $(DRA_COVERAGE_REPORTS)
	cp -r ./coverage/* $(DRA_COVERAGE_REPORTS)

test: $(TEST_TARGETS)

#####
# end test
#####

#####
# lint rules
#####

ESLINT:=npx eslint
LINT_REPORT:=$(QA)/lint.txt
LINT_PASS_MARKER:=$(QA)/.lint.passed
PRECIOUS_TARGETS+=$(LINT_REPORT)

LINT_TARGETS+=$(LINT_REPORT) $(LINT_PASS_MARKER)

LINT_IGNORE_PATTERNS:=--ignore-pattern '$(DIST)/**/*'

$(LINT_REPORT) $(LINT_PASS_MARKER) &: $(ALL_JS_FILES_SRC)
	mkdir -p $(dir $@)
	echo -n 'Test git rev: ' > $(LINT_REPORT)
	git rev-parse HEAD >> $(LINT_REPORT)
	( set -e; set -o pipefail; \
	  $(ESLINT) \
	    --ext .cjs,.js,.mjs,.cjs,.xjs \
	    $(LINT_IGNORE_PATTERNS) \
	    . \
	    | tee -a $(LINT_REPORT); \
	  touch $(LINT_PASS_MARKER) )

lint-fix:
	@( set -e; set -o pipefail; \
	  $(ESLINT) \
	    --ext .js,.mjs,.cjs,.xjs \
	    $(LINT_IGNORE_PATTERNS) \
	    --fix . )

lint: $(LINT_TARGETS)

#####
# end lint
#####

qa: test lint

all: build

.DEFAULT_GOAL:=build

.PHONY: all build qa test