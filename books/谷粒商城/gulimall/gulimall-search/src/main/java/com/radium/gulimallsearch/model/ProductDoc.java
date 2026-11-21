package com.radium.gulimallsearch.model;

import lombok.Data;

@Data
public class ProductDoc {

    private Long id;

    private String name;

    private String brand;

    private String category;

    private Long price;

    private Integer stock;

    private Float rating;

    private String description;

    private String created;
}
