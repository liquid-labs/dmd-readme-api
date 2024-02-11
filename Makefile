SRC:=.
DIST:=dist
QA:=qa

DRA_DATA_SELECTOR=\( -path "*/test/data/*"  -o -path "*/test/data-*/*" -o -path "*/test-data/*" \)

# all test data (cli and lib)
DRA_TEST_DATA_SRC:=$(shell find $(SRC) -type f $(DRA_DATA_SELECTOR))

RDA_JS_SELECTOR=\( -name "*.js" -o -name "*.cjs" -o -name "*.mjs" -o -name "*.jsx" \)
RDA_TEST_SELECTOR=\( -name "*.test.*js" -o -path "*/test/*" \)

# all source, non-test files (cli and lib)
RDA_ALL_JS_FILES_SRC:=$(shell find $(SRC) $(DRA_JS_SELECTOR) -not $(DRA_DATA_SELECTOR) -type f)
RDA_ALL_NON_TEST_JS_FILES_SRC:=$(shell find $(SRC) $(DRA_JS_SELECTOR) -not $(DRA_DATA_SELECTOR) -not $(DRA_TEST_SELECTOR) -type f)


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


$(DRA_TEST_DATA_BUILT): $(TEST_STAGING)/%: $(SRC)/%
	@echo "Copying test data..."
	@mkdir -p $(dir $@)
	@cp $< $@

$(DRA_TEST_PASS_MARKER) $(DRA_TEST_REPORT) $(TEST_STAGING)/coverage &: package.json $(DRA_ALL_JS_FILES_SRC) $(DRA_TEST_DATA_SRC)
	rm -rf $@
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

$(DRA_COVERAGE_REPORTS): $(DRA_TEST_PASS_MARKER) $(TEST_STAGING)/coverage
	rm -rf $(DRA_COVERAGE_REPORTS)
	mkdir -p $(DRA_COVERAGE_REPORTS)
	cp -r $(TEST_STAGING)/coverage/* $(DRA_COVERAGE_REPORTS)

#####
# end test
#####

foo:
	echo $(TEST_TARGETS)

test: $(TEST_TARGETS)

.PHONY: test