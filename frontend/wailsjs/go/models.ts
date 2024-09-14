export namespace domain {
	
	export class Customer {
	    id: number;
	    name: string;
	    created_at: time.Time;
	    ci: string;
	
	    static createFrom(source: any = {}) {
	        return new Customer(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.created_at = this.convertValues(source["created_at"], time.Time);
	        this.ci = source["ci"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DateArg {
	    date: time.Time;
	    client_time_zone: string;
	
	    static createFrom(source: any = {}) {
	        return new DateArg(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.date = this.convertValues(source["date"], time.Time);
	        this.client_time_zone = source["client_time_zone"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Message {
	    success: boolean;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new Message(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.error = source["error"];
	    }
	}
	export class OrderItem {
	    id: number;
	    product_id: number;
	    order_id: number;
	    quantity: number;
	    unit_price: number;
	    subtotal: number;
	
	    static createFrom(source: any = {}) {
	        return new OrderItem(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.product_id = source["product_id"];
	        this.order_id = source["order_id"];
	        this.quantity = source["quantity"];
	        this.unit_price = source["unit_price"];
	        this.subtotal = source["subtotal"];
	    }
	}
	export class Order {
	    id: number;
	    customer_id?: number;
	    items: OrderItem[];
	    created_at: time.Time;
	    updated_at: time.Time;
	    payment_method?: string;
	    status: string;
	    paid_at?: time.Time;
	    total_amount: number;
	
	    static createFrom(source: any = {}) {
	        return new Order(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.customer_id = source["customer_id"];
	        this.items = this.convertValues(source["items"], OrderItem);
	        this.created_at = this.convertValues(source["created_at"], time.Time);
	        this.updated_at = this.convertValues(source["updated_at"], time.Time);
	        this.payment_method = source["payment_method"];
	        this.status = source["status"];
	        this.paid_at = this.convertValues(source["paid_at"], time.Time);
	        this.total_amount = source["total_amount"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class OrderItemPayload {
	    product_id: number;
	    quantity: number;
	    unit_price: number;
	    subtotal: number;
	
	    static createFrom(source: any = {}) {
	        return new OrderItemPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.product_id = source["product_id"];
	        this.quantity = source["quantity"];
	        this.unit_price = source["unit_price"];
	        this.subtotal = source["subtotal"];
	    }
	}
	export class OrderPayload {
	    customer_id?: number;
	    payment_method?: string;
	
	    static createFrom(source: any = {}) {
	        return new OrderPayload(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.customer_id = source["customer_id"];
	        this.payment_method = source["payment_method"];
	    }
	}
	export class Product {
	    id: number;
	    name: string;
	    purchase_price: number;
	    sale_price: number;
	
	    static createFrom(source: any = {}) {
	        return new Product(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.name = source["name"];
	        this.purchase_price = source["purchase_price"];
	        this.sale_price = source["sale_price"];
	    }
	}

}

export namespace time {
	
	export class Time {
	
	
	    static createFrom(source: any = {}) {
	        return new Time(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	
	    }
	}

}

