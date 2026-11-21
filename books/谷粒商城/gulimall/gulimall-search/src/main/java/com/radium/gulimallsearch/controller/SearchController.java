package com.radium.gulimallsearch.controller;

import com.radium.gulimall.common.utils.R;
import com.radium.gulimallsearch.model.ProductDoc;
import com.radium.gulimallsearch.service.SearchService;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("gulimallsearch")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @RequestMapping("/index/init")
    public R initIndex() throws IOException {
        return R.ok().put("data", searchService.initIndex());
    }

    @RequestMapping("/index/delete")
    public R deleteIndex() throws IOException {
        return R.ok().put("data", searchService.dropIndex());
    }

    @RequestMapping(value = "/save", method = RequestMethod.POST)
    public R save(@RequestBody ProductDoc doc) throws IOException {
        return R.ok().put("data", searchService.save(doc));
    }

    @RequestMapping(value = "/bulk", method = RequestMethod.POST)
    public R bulk(@RequestBody List<ProductDoc> docs) throws IOException {
        return R.ok().put("data", searchService.bulkSave(docs));
    }

    @RequestMapping("/import")
    public R importFrom(@RequestParam(value = "source", defaultValue = "products") String source,
                        @RequestParam(value = "size", defaultValue = "500") int size) throws IOException {
        return R.ok().put("data", searchService.importFrom(source, size));
    }

    @RequestMapping("/search")
    public R search(@RequestParam("keyword") String keyword,
                    @RequestParam(value = "page", defaultValue = "1") int page,
                    @RequestParam(value = "limit", defaultValue = "10") int limit) throws IOException {
        return R.ok().put("data", searchService.search(keyword, page, limit));
    }

    @RequestMapping("/analyze")
    public R analyze(@RequestParam(value = "analyzer", defaultValue = "ik_smart") String analyzer,
                     @RequestParam("text") String text) throws IOException {
        return R.ok().put("data", searchService.analyze(analyzer, text));
    }
}
