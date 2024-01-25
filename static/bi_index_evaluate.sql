-- Evaluate by selected parameter
-- binance_index - obsahuje seznam indexu
-- binance_index_asset - obsahuje seznam coinu v jednotlivych indexech
-- (vlastni index - zadat nazev, coiny a zastoupeni, max. 10 coinu na jeden index, celkovy soucet zastoupeni musi byt 100%)

-- Vynosnost pravidelnych investic pro jednotlive meny: minute, hour, week, month

call binance.bi_index_evaluate('asset_minute');
-- Investice v intervalu: minute
SELECT * FROM binance.binance_index_asset_recom_minute ORDER BY profit DESC;

call binance.bi_index_evaluate('asset_hour');
-- Investice v intervalu: hour
SELECT * FROM binance.binance_index_asset_recom_hour ORDER BY profit DESC;

call binance.bi_index_evaluate('asset_week');
-- Investice v intervalu: week
SELECT * FROM binance.binance_index_asset_recom_week ORDER BY profit DESC;

call binance.bi_index_evaluate('asset_month');
-- Investice v intervalu: month
SELECT * FROM binance.binance_index_asset_recom_month ORDER BY profit DESC;

-- -----------------------------------------------------------------------------------------

-- Vypis indexu vcetne alokovanych zdroju
-- Vynosnost pravidelnych investic pro indexy: minute, hour, week, month

call binance.bi_index_evaluate('index_minute'); -- pro investovani jednou za hodinu
-- Investice v intervalu: minute
SELECT * FROM binance.binance_index_recom_minute ORDER BY profit DESC;

call binance.bi_index_evaluate('index_hour'); -- pro investovani jednou za den
-- Investice v intervalu: hour
SELECT * FROM binance.binance_index_recom_hour ORDER BY profit DESC;

call binance.bi_index_evaluate('index_week'); -- pro investovani jednou za tyden 1 = Nedele
-- Investice v intervalu: week
SELECT * FROM binance.binance_index_recom_week ORDER BY profit DESC;

call binance.bi_index_evaluate('index_month'); -- Pro investovani jednou za mesic den 1-28 (29, 30, 31 se automat neobchoduje)
-- Investice v intervalu: month
SELECT * FROM binance.binance_index_recom_month ORDER BY profit DESC;

-- Globalni vypis napric vsemi granularitami
call binance.bi_index_evaluate('index_all');
-- Vynosnost pravidelnych investic pro indexy: minute, hour, week, month
SELECT * FROM binance.binance_index_recom_all ORDER BY profit DESC;

