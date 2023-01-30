enum ShopCurrencies {
    COINS = new CoinsCurrency(),
    BLOOD_MONEY = new BloodMoneyCurrency(),
    CASTLE_WARS_TICKET = new CastleWarsTicketCurrency(),
    POINTS = new PointsCurrency()
    }
    
    class ShopCurrency {}
    
    class CoinsCurrency extends ShopCurrency {}
    
    class BloodMoneyCurrency extends ShopCurrency {}
    
    class CastleWarsTicketCurrency extends ShopCurrency {}
    
    class PointsCurrency extends ShopCurrency {}
    
    function get(shopCurrencies: ShopCurrencies) {
    return shopCurrencies;
}