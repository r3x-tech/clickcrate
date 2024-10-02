/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/clickcrate_program.json`.
 */
export type ClickcrateProgram = {
  "address": "8haS17iUkRL1aMchExXTcLS5J8iHwupN9gWWRNLD9q3v",
  "metadata": {
    "name": "clickcrateProgram",
    "version": "0.4.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "activateClickcrate",
      "discriminator": [
        81,
        143,
        45,
        111,
        139,
        140,
        223,
        72
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "clickcrate.id",
                "account": "clickCrateState"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "clickcrate"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "activateProductListing",
      "discriminator": [
        59,
        174,
        122,
        230,
        190,
        160,
        92,
        20
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "product_listing.id",
                "account": "productListingState"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "productListing"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "closeOracle",
      "discriminator": [
        74,
        239,
        49,
        223,
        206,
        52,
        189,
        123
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "product",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "productId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "completeOrder",
      "discriminator": [
        73,
        78,
        89,
        7,
        140,
        132,
        17,
        97
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "product"
              }
            ]
          }
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "product",
          "writable": true
        },
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "deactivateClickcrate",
      "discriminator": [
        72,
        46,
        232,
        105,
        48,
        53,
        185,
        227
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "clickcrate.id",
                "account": "clickCrateState"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "clickcrate"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "deactivateProductListing",
      "discriminator": [
        102,
        7,
        237,
        206,
        191,
        47,
        188,
        61
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "product_listing.id",
                "account": "productListingState"
              }
            ]
          }
        },
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "productListing"
          ]
        }
      ],
      "args": []
    },
    {
      "name": "initializeOracle",
      "discriminator": [
        144,
        223,
        131,
        120,
        196,
        253,
        181,
        99
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "product",
          "writable": true
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "productId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "makePurchase",
      "discriminator": [
        193,
        62,
        227,
        136,
        105,
        212,
        201,
        20
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "clickcrateId"
              }
            ]
          }
        },
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "listingCollection",
          "writable": true
        },
        {
          "name": "productAccount",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "clickcrate",
            "productListing"
          ]
        },
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "coreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "clickcrateId",
          "type": "pubkey"
        },
        {
          "name": "productId",
          "type": "pubkey"
        },
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "placeProducts",
      "discriminator": [
        39,
        86,
        179,
        53,
        43,
        82,
        94,
        45
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "clickcrateId"
              }
            ]
          }
        },
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "listingCollection",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "clickcrate",
            "productListing"
          ]
        },
        {
          "name": "coreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "clickcrateId",
          "type": "pubkey"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    },
    {
      "name": "registerClickcrate",
      "discriminator": [
        44,
        199,
        5,
        86,
        66,
        240,
        70,
        35
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "pubkey"
        },
        {
          "name": "eligiblePlacementType",
          "type": {
            "defined": {
              "name": "placementType"
            }
          }
        },
        {
          "name": "eligibleProductCategory",
          "type": {
            "defined": {
              "name": "productCategory"
            }
          }
        },
        {
          "name": "manager",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "registerProductListing",
      "discriminator": [
        22,
        144,
        48,
        241,
        143,
        78,
        58,
        135
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "pubkey"
        },
        {
          "name": "origin",
          "type": {
            "defined": {
              "name": "origin"
            }
          }
        },
        {
          "name": "placementType",
          "type": {
            "defined": {
              "name": "placementType"
            }
          }
        },
        {
          "name": "productCategory",
          "type": {
            "defined": {
              "name": "productCategory"
            }
          }
        },
        {
          "name": "manager",
          "type": "pubkey"
        },
        {
          "name": "orderManager",
          "type": {
            "defined": {
              "name": "origin"
            }
          }
        }
      ]
    },
    {
      "name": "removeProducts",
      "discriminator": [
        173,
        2,
        240,
        38,
        141,
        175,
        120,
        124
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "clickcrateId"
              }
            ]
          }
        },
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "listingCollection",
          "writable": true
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "clickcrate",
            "productListing"
          ]
        },
        {
          "name": "coreProgram",
          "address": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "clickcrateId",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateClickcrate",
      "discriminator": [
        88,
        218,
        191,
        63,
        64,
        49,
        133,
        96
      ],
      "accounts": [
        {
          "name": "clickcrate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  105,
                  99,
                  107,
                  99,
                  114,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "pubkey"
        },
        {
          "name": "eligiblePlacementType",
          "type": {
            "defined": {
              "name": "placementType"
            }
          }
        },
        {
          "name": "eligibleProductCategory",
          "type": {
            "defined": {
              "name": "productCategory"
            }
          }
        },
        {
          "name": "manager",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "updateOrderStatus",
      "discriminator": [
        88,
        95,
        133,
        241,
        63,
        159,
        32,
        71
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "productListingId"
              }
            ]
          }
        },
        {
          "name": "oracle",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "productId"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "productListing"
          ]
        },
        {
          "name": "seller",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "productId",
          "type": "pubkey"
        },
        {
          "name": "productListingId",
          "type": "pubkey"
        },
        {
          "name": "newOrderStatus",
          "type": {
            "defined": {
              "name": "orderStatus"
            }
          }
        }
      ]
    },
    {
      "name": "updateProductListing",
      "discriminator": [
        201,
        155,
        135,
        164,
        93,
        135,
        174,
        209
      ],
      "accounts": [
        {
          "name": "productListing",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "arg",
                "path": "id"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "id",
          "type": "pubkey"
        },
        {
          "name": "placementType",
          "type": {
            "defined": {
              "name": "placementType"
            }
          }
        },
        {
          "name": "productCategory",
          "type": {
            "defined": {
              "name": "productCategory"
            }
          }
        },
        {
          "name": "manager",
          "type": "pubkey"
        },
        {
          "name": "price",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "clickCrateState",
      "discriminator": [
        74,
        128,
        24,
        160,
        44,
        211,
        75,
        6
      ]
    },
    {
      "name": "orderOracle",
      "discriminator": [
        192,
        227,
        150,
        94,
        198,
        44,
        108,
        107
      ]
    },
    {
      "name": "productListingState",
      "discriminator": [
        97,
        129,
        39,
        209,
        209,
        102,
        189,
        139
      ]
    },
    {
      "name": "vaultAccount",
      "discriminator": [
        230,
        251,
        241,
        83,
        139,
        202,
        93,
        28
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "accountBorrowFailed",
      "msg": "Failed to borrow account data"
    },
    {
      "code": 6001,
      "name": "addPluginFailed",
      "msg": "Failed to add plugin"
    },
    {
      "code": 6002,
      "name": "clickCrateExists",
      "msg": "ClickCrate already registered"
    },
    {
      "code": 6003,
      "name": "clickCrateActivated",
      "msg": "ClickCrate is actived"
    },
    {
      "code": 6004,
      "name": "clickCrateDeactivated",
      "msg": "ClickCrate is deactived"
    },
    {
      "code": 6005,
      "name": "clickCrateNotFound",
      "msg": "ClickCrate not found"
    },
    {
      "code": 6006,
      "name": "invalidClickCrateRegistration",
      "msg": "Invalid clickcrate registration"
    },
    {
      "code": 6007,
      "name": "productNotFound",
      "msg": "Product Listing was not found"
    },
    {
      "code": 6008,
      "name": "productListingExists",
      "msg": "Product Listing already registered"
    },
    {
      "code": 6009,
      "name": "productListingActivated",
      "msg": "Product Listing is actived"
    },
    {
      "code": 6010,
      "name": "productListingDeactivated",
      "msg": "Product Listing is deactived"
    },
    {
      "code": 6011,
      "name": "productNotPlaced",
      "msg": "Product not placed"
    },
    {
      "code": 6012,
      "name": "productOutOfStock",
      "msg": "Product out of stock"
    },
    {
      "code": 6013,
      "name": "invalidProductAccount",
      "msg": "Invalid product account"
    },
    {
      "code": 6014,
      "name": "invalidStockingRequest",
      "msg": "Invalid stocking request"
    },
    {
      "code": 6015,
      "name": "invalidStockingAmount",
      "msg": "Invalid stocking amount"
    },
    {
      "code": 6016,
      "name": "invalidRemovalRequest",
      "msg": "Invalid removal request"
    },
    {
      "code": 6017,
      "name": "invalidRemovalAmount",
      "msg": "Invalid removal amount"
    },
    {
      "code": 6018,
      "name": "invalidProductListingRegistration",
      "msg": "Invalid listing registration"
    },
    {
      "code": 6019,
      "name": "productRemovalFailed",
      "msg": "Product removal failed"
    },
    {
      "code": 6020,
      "name": "priceNotFound",
      "msg": "Price not found"
    },
    {
      "code": 6021,
      "name": "orderNotFound",
      "msg": "Order not found"
    },
    {
      "code": 6022,
      "name": "orderNotConfirmed",
      "msg": "Order not confirmed"
    },
    {
      "code": 6023,
      "name": "orderNotCompleted",
      "msg": "Order not completed"
    },
    {
      "code": 6024,
      "name": "ordersInProgress",
      "msg": "Orders in progress"
    },
    {
      "code": 6025,
      "name": "invalidOrderOracleAccount",
      "msg": "Invalid oracle"
    },
    {
      "code": 6026,
      "name": "invalidVaultAccount",
      "msg": "Invalid vault"
    },
    {
      "code": 6027,
      "name": "freezeAuthorityNotFound",
      "msg": "Freeze authority not found"
    },
    {
      "code": 6028,
      "name": "transferAuthorityNotFound",
      "msg": "Transfer authority not found"
    },
    {
      "code": 6029,
      "name": "invalidFreezeAuthority",
      "msg": "Invalid freeze authority"
    },
    {
      "code": 6030,
      "name": "invalidTransferAuthority",
      "msg": "Invalid transfer authority"
    },
    {
      "code": 6031,
      "name": "vaultNotEmpty",
      "msg": "Vault not empty"
    },
    {
      "code": 6032,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    },
    {
      "code": 6033,
      "name": "oracleFailedToClose",
      "msg": "Oracle account closure failed"
    },
    {
      "code": 6034,
      "name": "oracleNotFound",
      "msg": "Oracle not found"
    },
    {
      "code": 6035,
      "name": "oracleAlreadyUpdated",
      "msg": "Oracle already updated"
    },
    {
      "code": 6036,
      "name": "unauthorizedUpdate",
      "msg": "Unauthorized update"
    },
    {
      "code": 6037,
      "name": "unauthorizedClose",
      "msg": "Unauthorized close"
    }
  ],
  "types": [
    {
      "name": "clickCrateState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "eligiblePlacementType",
            "type": {
              "defined": {
                "name": "placementType"
              }
            }
          },
          {
            "name": "eligibleProductCategory",
            "type": {
              "defined": {
                "name": "productCategory"
              }
            }
          },
          {
            "name": "product",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "externalValidationResult",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "approved"
          },
          {
            "name": "rejected"
          },
          {
            "name": "pass"
          }
        ]
      }
    },
    {
      "name": "oracleValidation",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "uninitialized"
          },
          {
            "name": "v1",
            "fields": [
              {
                "name": "create",
                "type": {
                  "defined": {
                    "name": "externalValidationResult"
                  }
                }
              },
              {
                "name": "transfer",
                "type": {
                  "defined": {
                    "name": "externalValidationResult"
                  }
                }
              },
              {
                "name": "burn",
                "type": {
                  "defined": {
                    "name": "externalValidationResult"
                  }
                }
              },
              {
                "name": "update",
                "type": {
                  "defined": {
                    "name": "externalValidationResult"
                  }
                }
              }
            ]
          }
        ]
      }
    },
    {
      "name": "orderOracle",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderStatus",
            "type": {
              "defined": {
                "name": "orderStatus"
              }
            }
          },
          {
            "name": "orderManager",
            "type": {
              "defined": {
                "name": "origin"
              }
            }
          },
          {
            "name": "validation",
            "type": {
              "defined": {
                "name": "oracleValidation"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "orderStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "placed"
          },
          {
            "name": "confirmed"
          },
          {
            "name": "fulfilled"
          },
          {
            "name": "delivered"
          },
          {
            "name": "completed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "origin",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "clickcrate"
          },
          {
            "name": "shopify"
          },
          {
            "name": "square"
          }
        ]
      }
    },
    {
      "name": "placementType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "digitalreplica"
          },
          {
            "name": "relatedpurchase"
          },
          {
            "name": "targetedplacement"
          }
        ]
      }
    },
    {
      "name": "productCategory",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "clothing"
          },
          {
            "name": "electronics"
          },
          {
            "name": "books"
          },
          {
            "name": "home"
          },
          {
            "name": "beauty"
          },
          {
            "name": "toys"
          },
          {
            "name": "sports"
          },
          {
            "name": "automotive"
          },
          {
            "name": "grocery"
          },
          {
            "name": "beverage"
          },
          {
            "name": "health"
          }
        ]
      }
    },
    {
      "name": "productListingState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "pubkey"
          },
          {
            "name": "origin",
            "type": {
              "defined": {
                "name": "origin"
              }
            }
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "manager",
            "type": "pubkey"
          },
          {
            "name": "placementType",
            "type": {
              "defined": {
                "name": "placementType"
              }
            }
          },
          {
            "name": "productCategory",
            "type": {
              "defined": {
                "name": "productCategory"
              }
            }
          },
          {
            "name": "inStock",
            "type": "u64"
          },
          {
            "name": "sold",
            "type": "u64"
          },
          {
            "name": "clickcratePos",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "price",
            "type": {
              "option": "u64"
            }
          },
          {
            "name": "vault",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "orderManager",
            "type": {
              "defined": {
                "name": "origin"
              }
            }
          }
        ]
      }
    },
    {
      "name": "vaultAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
