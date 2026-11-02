package com.radium.gulimallthirdpart.controller;

import com.radium.gulimall.common.utils.R;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("gulimallthirdpart")
public class ThirdPartController {

    @GetMapping("/ping")
    public R ping() {
        return R.ok().put("service", "gulimall-third-part");
    }
}
