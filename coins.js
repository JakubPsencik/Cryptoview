const coins = ["BTC", "ETH", "BNB", "SOL", "XRP", "MATIC", "ADA", "DOT", "LTC", "ATOM", "RNDR", "GRT", "INJ", "AGIX", "ROSE", "FET", "OCEAN", "ARKM", "MAV", "PENDLE", "SEI", "CYBER", "WBETH", "XVS", "RDNT", "CAKE", "BSW", "ALPACA", "STG", "ARB", "GMX", "MAGIC", "GNS", "JOE", "SAND", "MANA", "AXS", "GALA", "ILV", "ALICE", "IMX", "YGG", "LINK", "UNI", "LDO", "AAVE", "MKR", "COMP", "OP", "DOGE", "PEPE", "SHIB", "CHZ", "SANTOS", "ALPINE", "PORTO", "LAZIO", "BAR", "ACM", "OG", "PSG", "CITY", "AVAX", "APE", "RPL", "FXS", "LRC", "ANKR", "USDT", "TUSD", "FDUSD", "USDC", "XTZ", "RUNE", "LIT", "TRX", "ORDI", "JTO", "1000SATS", "ACE", "NTRN", "MEME", "TIA", "BEAMX", "FTM", "APT", "NEAR", "FLOKI", "CFX", "WOO", "ANT", "BAKE", "KDA", "IOTX", "STX", "BTTC", "TWT", "OSMO", "ASTR", "STORJ", "QI", "PYR", "MOVR", "SUPER", "DEGO", "NEO", "QTUM", "EOS", "SNT", "BNT", "GAS", "ZRX", "KNC", "FUN", "IOTA", "XVG", "MTL", "ETC", "ZEC", "AST", "DASH", "OAX", "REQ", "VIB", "POWR", "ENJ", "KMD", "NULS", "AMB", "BAT", "LSK", "ADX", "XLM", "WAVES", "ICX", "ELF", "RLC", "PIVX", "IOST", "STEEM", "BLZ", "ZIL", "ONT", "WAN", "SYS", "LOOM", "ZEN", "THETA", "QKC", "DATA", "SC", "DENT", "ARDR", "HOT", "VET", "DOCK", "RVN", "DCR", "REN", "ONG", "CELR", "OMG", "PHB", "TFUEL", "ONE", "ALGO", "DUSK", "WIN", "COS", "KEY", "CVC", "BAND", "HBAR", "NKN", "KAVA", "ARPA", "CTXC", "BCH", "TROY", "VITE", "FTT", "EUR", "OGN", "WRX", "LTO", "MBL", "COTI", "STPT", "CTSI", "HIVE", "CHR", "MDT", "STMX", "DGB", "SXP", "SNX", "VTHO", "IRIS", "FIO", "AVA", "BAL", "YFI", "JST", "CRV", "NMR", "LUNA", "IDEX", "RSR", "PAXG", "WNXM", "TRB", "WBTC", "SUSHI", "KSM", "EGLD", "DIA", "UMA", "BEL", "WING", "OXT", "SUN", "FLM", "SCRT", "ORN", "UTK", "ALPHA", "VIDT", "FIL", "AERGO", "AUDIO", "CTK", "AKRO", "HARD", "SLP", "FOR", "UNFI", "XEM", "SKL", "GLM", "JUV", "1INCH", "REEF", "ATM", "ASR", "CELO", "RIF", "TRU", "DEXE", "CKB", "FIRO", "SFP", "DODO", "FRONT", "UFT", "AUCTION", "PHA", "BADGER", "FIS", "OM", "POND", "LINA", "PERP", "TKO", "PUNDIX", "TLM", "FORTH", "BURGER", "ICP", "AR", "POLS", "MDX", "MASK", "LPT", "ATA", "GTC", "ERN", "KLAY", "BOND", "MLN", "QUICK", "C98", "CLV", "QNT", "FLOW", "MINA", "RAY", "FARM", "MBOX", "GHST", "WAXP", "GNO", "PROM", "XEC", "DYDX", "USDP", "DF", "FIDA", "CVP", "AGLD", "RAD", "BETA", "RARE", "SSV", "CHESS", "DAR", "BNX", "ENS", "KP3R", "VGX", "JASMY", "AMP", "ALCX", "BICO", "FLUX", "VOXEL", "HIGH", "CVX", "PEOPLE", "OOKI", "SPELL", "ACH", "GLMR", "LOKA", "API3", "ACA", "XNO", "T", "NBT", "GMT", "BIFI", "NEXO", "REI", "GAL", "EPX", "LEVER", "LUNC", "POLYX", "HFT", "HOOK", "HIFI", "PROS", "SYN", "LQTY", "USTC", "ID", "EDU", "SUI", "COMBO", "WLD", "ARK", "CREAM", "GFT", "IQ", "VIC", "BLUR", "VANRY", "AEUR", "BONK", "NFP", "AI", "XAI", "SLM", "FLR", "MANTA", "ALT", "JUP", "PYTH", "RONIN", "DYM", "PIXEL", "STRK", "PORTAL", "PDA", "AXL", "WIF", "METIS", "AEVO", "BOME", "ETHFI", "STRAX", "ENA", "W", "TNSR", "SAGA", "TAO", "OMNI", "REZ", "BB", "NOT"]