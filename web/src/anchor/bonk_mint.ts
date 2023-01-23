export type BonkMint = {
  "version": "0.1.0",
  "name": "bonk_mint",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "devFee",
          "type": "u64"
        },
        {
          "name": "artistFee",
          "type": "u64"
        },
        {
          "name": "devTokenAta",
          "type": "publicKey"
        },
        {
          "name": "artistTokenAta",
          "type": "publicKey"
        },
        {
          "name": "burnAmount",
          "type": "u64"
        },
        {
          "name": "tokenMint",
          "type": "publicKey"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "itemUriBase",
          "type": "string"
        },
        {
          "name": "itemNameBase",
          "type": "string"
        },
        {
          "name": "collectionSize",
          "type": "u32"
        },
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "royalty",
          "type": "u16"
        }
      ]
    },
    {
      "name": "mintNft",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artistTokenAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECKs Does not need additional check"
          ]
        },
        {
          "name": "devTokenAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECKs Does not need additional check"
          ]
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userBurnAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMinBurnAmount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "burnAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collectionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u32"
          },
          {
            "name": "next",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "collection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "devFee",
            "type": "u64"
          },
          {
            "name": "artistFee",
            "type": "u64"
          },
          {
            "name": "artistTokenAta",
            "type": "publicKey"
          },
          {
            "name": "devTokenAta",
            "type": "publicKey"
          },
          {
            "name": "burnAmount",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "royalty",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "itemNameBase",
            "type": "string"
          },
          {
            "name": "itemUriBase",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MintComplete",
      "msg": "No more items to mint"
    },
    {
      "code": 6001,
      "name": "NotEnoughBurn",
      "msg": "User selected less than the minimum burn amount"
    }
  ]
};

export const IDL: BonkMint = {
  "version": "0.1.0",
  "name": "bonk_mint",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "devFee",
          "type": "u64"
        },
        {
          "name": "artistFee",
          "type": "u64"
        },
        {
          "name": "devTokenAta",
          "type": "publicKey"
        },
        {
          "name": "artistTokenAta",
          "type": "publicKey"
        },
        {
          "name": "burnAmount",
          "type": "u64"
        },
        {
          "name": "tokenMint",
          "type": "publicKey"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "itemUriBase",
          "type": "string"
        },
        {
          "name": "itemNameBase",
          "type": "string"
        },
        {
          "name": "collectionSize",
          "type": "u32"
        },
        {
          "name": "creator",
          "type": "publicKey"
        },
        {
          "name": "royalty",
          "type": "u16"
        }
      ]
    },
    {
      "name": "mintNft",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "collectionState",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftMint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "nftAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "artistTokenAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECKs Does not need additional check"
          ]
        },
        {
          "name": "devTokenAta",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECKs Does not need additional check"
          ]
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "userBurnAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateMinBurnAmount",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "collection",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "burnAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "collectionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "total",
            "type": "u32"
          },
          {
            "name": "next",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "collection",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "devFee",
            "type": "u64"
          },
          {
            "name": "artistFee",
            "type": "u64"
          },
          {
            "name": "artistTokenAta",
            "type": "publicKey"
          },
          {
            "name": "devTokenAta",
            "type": "publicKey"
          },
          {
            "name": "burnAmount",
            "type": "u64"
          },
          {
            "name": "creator",
            "type": "publicKey"
          },
          {
            "name": "royalty",
            "type": "u16"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "symbol",
            "type": "string"
          },
          {
            "name": "itemNameBase",
            "type": "string"
          },
          {
            "name": "itemUriBase",
            "type": "string"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MintComplete",
      "msg": "No more items to mint"
    },
    {
      "code": 6001,
      "name": "NotEnoughBurn",
      "msg": "User selected less than the minimum burn amount"
    }
  ]
};
