# Dev Notes

Stuff we fix vs. the standard [JSDoc DMD](https://github.com/jsdoc2md/dmd):
- Try and normalize all the section spacing to a single line. There's an unknown error where the last is getting cut off sometimes, but not always, so we have to do two for some sections to keep things working (see [`description.hbs`](./partial/all-docs/docs/body/description.hbs) for an example; search for TODO for more).
- Make [`throws.hbs`](./partial/all-docs/docs/body/throws.hbs) smart about using one line for a single entry and a list if multiple.
- Added 'list' format ([`global-index-list.hbs`](./partial/main-index/global-index/global-index-list.hbs) format to the global index
- Made index signatures more cmpact in the index listings ([`sig-name-only-link.hbs`](./partial/shared/signature/sig-name-only-link.hbs)).
- Only display the 'Kind' when it's complex; no need to tell someone it's a basic function or constant or whatever. (which is oddly defined in [`scope.hbs`](./partial/all-docs/docs/body/scope.hbs), but we keep it to mirror base DMD).
- Removed last vestigates of HTML (`<code>`s).
- Added detection of the 'summary' (first line of description) for use in index. Before was dropping the whole description in the index links!
- Added sort to the underlying data so everything is listed in a consistent manner.
- Added support for `@kind component` as a distinct kind of thing.
- Simplified the [`global-index.hbs`](./partial/main-index/global-index/global-index.hbs) to key off the `kinds()` array from [`ddata.js`](./helpers/ddata.js).
- Fixed problem in [`sig-name.hbs`](./partial/shared/signature/sig-name.hbs) where it was unecessarily escaping names even when inside tick-quotes.
- Added configurable document title.
- Fixed problem where return types with Arrays was escaping the `<>` chars.