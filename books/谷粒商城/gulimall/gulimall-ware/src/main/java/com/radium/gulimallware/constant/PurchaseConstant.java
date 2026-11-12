package com.radium.gulimallware.constant;

public class PurchaseConstant {

    /** 采购单状态 */
    public enum PurchaseStatus {
        CREATED(0), ASSIGNED(1), RECEIVE(2), FINISH(3), HASERROR(4);

        private final int code;

        PurchaseStatus(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }
    }

    /** 采购需求状态 */
    public enum DetailStatus {
        CREATED(0), ASSIGNED(1), BUYING(2), FINISH(3), HASERROR(4);

        private final int code;

        DetailStatus(int code) {
            this.code = code;
        }

        public int getCode() {
            return code;
        }
    }
}
