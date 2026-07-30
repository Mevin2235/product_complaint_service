// =====================================================
// utils/payloadBuilder.js
// =====================================================

class PayloadBuilder {

    build(item) {

        return {

            ServiceRequestID: item.ServiceRequestID,

            ProductID: item.ProductID,

            Description: item.Description,

            SettlementMode_KUTText:
                item.SettlementMode_KUTText,

            TotalAmountContent_KUT:
                item.TotalAmountContent_KUT,

            TotalAmountcurrencyCode_KUT:
                item.TotalAmountcurrencyCode_KUT

        };

    }

    buildMultiple(items = []) {

        return items.map(item => this.build(item));

    }

}

module.exports = new PayloadBuilder();