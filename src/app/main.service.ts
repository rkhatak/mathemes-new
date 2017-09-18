import { Injectable, Inject, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Globals } from './globals';
import { DOCUMENT } from '@angular/platform-browser';
import * as _ from 'underscore';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
declare var $: any;

@Injectable()
export class MainService implements OnDestroy {
    constructor(private router:Router,private _http: Http, public globals: Globals, @Inject(DOCUMENT) private document: any) {
        this.onCartChange$Subscription = this.globals.onCartChange.subscribe(() => {
            this.cart = this.globals.cart;
            this.items = this.globals.items;
        });
    }
    minRedemption:any=100;
    cart: any;
    items: any;
    restaurantDeal: any;
    selectedDeal: any = false;
    promocode: any;
    date: any;
    time: any;
    selectedDate: any;
    selectedTime: any;
    dates: any;
    timeEdit: boolean;
    order_type: string = 'takeout';
    weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    pages = ['home', 'about', 'menu', 'gallery', 'contact', 'checkout'];

    private onCartChange$Subscription: Subscription;

    chainRes() {
        let path = location.pathname;
        let rootArr = path.split('/');
        let rootId = (typeof rootArr[1] !== 'undefined') ? rootArr[1] : '';
        let rootPage = (typeof rootArr[2] !== 'undefined') ? rootArr[2] : '';
        for (let i = 0; i <= this.pages.length; i++) {
            if (rootId == this.pages[i]) {
                rootPage = this.pages[i];
            }
        }
        return { 'rootId': rootId, 'rootPage': rootPage };

    }

    postToken(): Observable<any> {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'auth/token';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = JSON.stringify({});

        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
    }

    getApiUrl(myUrl) {
        let self = this;
        if (myUrl.indexOf('token=') == -1) {
            myUrl += ((myUrl.indexOf('?') == -1) ? '?' : '&');
            myUrl += "token=" + this.getStorage('oauth.token');
        }
        return self.globals.apiBaseUrl + myUrl;

    };

    getToken(): Observable<any> {
        let self = this;
        let authToken = this.getStorage('oauth.token');
        let apiUrl = self.globals.apiBaseUrl + 'auth/token/' + authToken;
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    getTheme() {
        let themeUrl = 'assets/theme.require.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json());
        //.do(data => console.log(JSON.stringify(data)));
    }

    getRestaurantDetails(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/details/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    setLocation() {
        let data = { city_id: 18848, token: this.getStorage('oauth.token') };
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'user/location';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());

    }
    getUserDetails() {
        let self = this;
        let apiUrl = self.getApiUrl('user/details');
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    userLogout() {
        let self = this;
        let apiUrl = self.getApiUrl('user/logout');
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }



    getRestaurantOverview(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/overview/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantMenu(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/menu/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantMenuAddons(menuId) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/menu-addons/' + menuId);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantDeals(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/deals-coupons/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantGallery(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/gallery/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getRestaurantStory(resid) {
        let self = this;
        let apiUrl = self.getApiUrl('restaurant/story/' + resid);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }

    getThemeDetails(theme) {
        let themeUrl = 'assets/data/' + theme + '.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json());
        //.do(data => console.log(JSON.stringify(data)));
    }
    getChainRestaurant(_theme) {
        let themeUrl = 'assets/data/' + _theme + '.restaurant.json'
        let self = this;
        return self._http.get(themeUrl)
            .map((response: Response) => <any>response.json());
    }

    setStorage(key, value) {
        localStorage.setItem(key, value);
    }

    getStorage(key) {
        return localStorage.getItem(key);
    }
    showPopUp() {
        this.document.querySelector('.a_modal').classList.remove('hide');
    }
    hidePopUp() {
        this.document.querySelector('.a_modal').classList.add('hide');
    }

    getDefaultTimeSlots(restId, orderType, orderDate) {
        var self = this;
        let apiUrl = self.getApiUrl('restaurant/timeslot/' + restId + '?date=' + orderDate + '&type=' + orderType);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());

    };

    digitToString(digit) {
        digit = parseInt(digit, 10);
        var string = "";
        switch (digit) {
            case 1:
                string = "one";
                break;
            case 2:
                string = "two";
                break;
            case 3:
                string = "three";
                break;
            case 4:
                string = "four";
                break;
            case 5:
                string = "five";
                break;
            case 6:
                string = "six";
                break;
            case 7:
                string = "seven";
                break;
            case 8:
                string = "eight";
                break;
            case 9:
                string = "nine";
                break;
            case 10:
                string = "ten";
                break;
        }
        return string;
    };

    parseDate(date) {
        if (typeof date === 'string') {
            date = date.replace(/\-/g, '/');
        }
        var dummyDate = new Date(date);
        if (Object.prototype.toString.call(dummyDate) === "[object Date]" && !isNaN(dummyDate.getTime())) {
            return dummyDate;
        }
        return new Date(date);
    }
    get12HourTime(time) {
        var date = this.parseDate('1970-01-01 ' + time);
        let hours: any = date.getHours();
        var isAM = hours >= 12 ? false : true;
        hours = hours > 12 ? hours - 12 : hours;
        hours = parseInt(hours, 10) === 0 ? 12 : hours;
        return this.paddLeft(hours, 0, 2) + ":" + this.paddLeft(date.getMinutes(), 0, 2) + " " + (isAM ? "AM" : "PM");
    };

    paddLeft(str, char, length) {
        if (str.length >= length)
            return str;
        var padding = char + "";
        for (var i = 1; i < length; i++) {
            padding += char;
        }
        var a = padding + str;
        return a.slice(-length);
    };
    getOperationsSlots(restId, date) {
        var self = this;
        let apiUrl = self.getApiUrl('restaurant/operations/' + restId + '?date=' + date);
        return self._http.get(apiUrl)
            .map((response) => <any>response.json());
    }
    candeliver(restId, lat, lng) {
        var self = this;
        let apiUrl = self.getApiUrl(`restaurant/candeliver/${restId}?lat=${lat}&lng=${lng}`);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }


    cartCalution() {
        var self = this;
        let restId = self.globals.globalRestaurantId;
        let order_items = (this.getStorage('order_items_' + restId))?JSON.parse(this.getStorage('order_items_' + restId)):[];
        let orderType = this.getStorage('order_type_' + restId);
        let tax: any = 0, subtotal: any = 0, total: any = 0;
        let delCharge: any = parseFloat(self.globals.currentRestaurantDetail.delivery_charge);
        if (!order_items) {
            order_items = [];
            this.setStorage('order_items_' + restId, JSON.stringify(order_items));
        }
        _.each(order_items, function (item: any) {
            subtotal = parseFloat(subtotal) + parseFloat(item.total_item_price);
        });
        subtotal = (Math.round(subtotal * 100) / 100).toFixed(2);
        this.getApplicableDeal(orderType, subtotal);
        let discount: any = 0;
        let promoDiscount: any = 0;
        if (self.selectedDeal) {
            if (self.selectedDeal.discount_type === 'flat') {
                discount = this.getNumber(self.selectedDeal.discount, 2);
            } else {
                discount = this.getNumber((subtotal * parseInt(self.selectedDeal.discount)) / 100, 2);
            }
        }
        if (self.promocode) {
            if (subtotal >= parseFloat(self.promocode.minimum_order_amount)) {
                if (self.promocode.discount_type === 'flat') {
                    promoDiscount = this.getNumber(self.promocode.discount, 2);
                } else {
                    promoDiscount = this.getNumber((subtotal * parseInt(self.promocode.discount)) / 100, 2);
                }
                this.setStorage("promocode_status", "valid");
            } else {
                this.setStorage("promocode_status", "invalid");
                $('.promo_code .error-message').removeClass('hide').html(`Minimum order must exceed ${self.promocode.minimum_order_amount}to redeem this Promo Code`);
            }
        }


        if (discount > 0) {
            $('.y-discount').removeClass('hide');
            $('.discount_amount').html(discount);
            $('.y-dealtext').removeClass('hide').html(self.selectedDeal.title);
        } else {
            $('.y-discount').addClass('hide');
            $('.discount_amount').html('');
            $('.y-dealtext').addClass('hide').html('');
        }
        if (promoDiscount > 0) {
            $('.y-promocode-apply, .t_promocode').removeClass('hide');
            $('.y-promocode, .promo_code .error-message').addClass('hide');

            $('.y-promocode-amount').html(promoDiscount);
            $('.y-promocode-coupan').html(this.getStorage("promocode"));

            $('.y-dealtext').removeClass('hide').html(self.promocode.title);
        } else {
            $('.y-promocode-apply, .t_promocode').addClass('hide');
            $('.y-promocode').removeClass('hide');
            $('#promocode').val('')
            $('.y-promocode-amount').html('');
            $('.y-promocode-coupan').html('');
            $('.y-dealtext').addClass('hide').html('');
        }
        var taxRate = 8.875;
        if (self.globals.currentRestaurantDetail) {
            taxRate = self.globals.currentRestaurantDetail.sales_tax;
        }
        this.setStorage('order_subtotal_' + restId, subtotal);
        tax = (subtotal * taxRate) / 100;
        tax = (Math.round(tax * 100) / 100).toFixed(2);
        total = parseFloat(subtotal) + parseFloat(tax);
        var tipAmount = "0.00";
        if (orderType == 'delivery') {
            this.getTipOptions();
            $('.y-tip,.y-tip-desc').removeClass('hide');
            var tip = self.getStorage('tip_' + restId);
            if (tip !== '') {
                tipAmount = this.getNumber((subtotal * parseInt(tip)) / 100, 2);
                total += parseFloat(tipAmount);
            }
            $(".default_tip").html('$' + tipAmount);
            self.setStorage('order_tip_' + restId, tipAmount);
            $('.t-deliverycharge').removeClass('hide');

            if (delCharge) {
                total += parseFloat(delCharge);
            }
        } else {
            $('.y-tip,.y-tip-desc').addClass('hide');
            $('.t-deliverycharge').addClass('hide');
        }
        total = (total - discount);
        total = (total - promoDiscount);
        total = (Math.round(total * 100) / 100).toFixed(2);
        $('.order_subtotal').html(subtotal);

        $('.order_tax').html(tax);
        if (delCharge < 1) {
            $('.t-deliverycharge').addClass('hide');
        } else {
            $('.deliverycharge_amount').html(self.globals.currentRestaurantDetail.delivery_charge);
        }
        $('.order_total').html(total);
        self.setStorage('order_tax_' + restId, tax);
        self.setStorage('order_total_' + restId, total);
        var min_order = 5;
        if (self.globals.currentRestaurantDetail) {
            min_order = parseFloat(self.globals.currentRestaurantDetail.minimum_delivery);
        }
        if ((min_order > 0) && (orderType === 'delivery')) {
            if (subtotal < min_order) {
                $('.t-min-order').removeClass('hide');
                $('.t_min_order').html(min_order);
            } else {
                $('.t-min-order').addClass('hide');
            }
        } else {
            $('.t-min-order').addClass('hide');
        }
        if (order_items.length > 0) {
            $('.t-no-order').addClass('hide');
        } else {
            if ((orderType === 'delivery') && (min_order > 0)) {
                $('.t-min-order').removeClass('hide');
            }
            $('.t-no-order').removeClass('hide');
        }

    }
    getTipOptions() {
        let self = this;
        var restId = self.globals.globalRestaurantId;
        var text = '<option value="0">No Tip</option>';
        var tips = this.getAllTips();
        let tip: any = self.getStorage('tip_' + restId);
        $.each(tips, function (per, value) {
            text += '<option value="' + per + '" ' + (tip == per ? "selected" : "") + '>' + per + '% ($' + value + ')</option>';
        });
        setTimeout(function () {
            $("select.t-tip-percent").html(text);
        }, 1000)

        var defaultTipText = "No Tip";
        if (tip != 0) {
            defaultTipText = tip + '% ($' + parseFloat(this.getNumber(((JSON.parse(self.getStorage('order_subtotal_' + restId)) * tip) / 100), 2)) + ')';
        }
        $(".default-tip").html(defaultTipText);
        //    $("select.t-tip-percent").off('change');
        //    $("select.t-tip-percent").on('change', $.proxy(App.updateTipPercent,App));
    }
    getAllTips() {
        return {
            "10": this.getTipAmount(10),
            "15": this.getTipAmount(15),
            "20": this.getTipAmount(20),
            "25": this.getTipAmount(25),
            "30": this.getTipAmount(30)
        };
    };
    getTipAmount(tip) {
        let self = this;
        var restId = self.globals.globalRestaurantId;
        if (JSON.parse(self.getStorage('order_subtotal_' + restId)) > 0) {
            return parseFloat(this.getNumber(((JSON.parse(self.getStorage('order_subtotal_' + restId)) * tip) / 100), 2));
        } else {
            return "0.00";
        }
    };

    restaurantDealFun() {
        let self = this;
        let restId = self.globals.globalRestaurantId;
        let apiUrl = self.getApiUrl('restaurant/deals-coupons/' + restId);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json()).subscribe((data) => {
                self.restaurantDeal = data;
            });
    };
    getApplicableDeal(orderType, subTotal) {
        let self = this;

        self.restaurantDealFun();
        if (!self.restaurantDeal || self.restaurantDeal.length === 0) {
            return false;
        }
        if (!orderType || _.isEmpty(orderType) || _.isUndefined(orderType) || !subTotal || _.isEmpty(subTotal) || _.isUndefined(subTotal)) {
            return [];
        }
        var filteredDeals = self.restaurantDeal.filter(function (model: any) {
            return (model.deal_for.indexOf(orderType.toLowerCase()) !== -1);
        });
        filteredDeals = _.filter(filteredDeals, function (model: any) {
            return parseFloat(model.minimum_order_amount) <= parseFloat(subTotal);
        });
        let decidedDiscount: any = 0;

        self.selectedDeal = false;
        _.each(filteredDeals, function (deal: any) {
            if (deal.type !== 'offer') {
                if (self.parseDate(self.globals.currentRestaurantDetail.current_dateTime) >= self.parseDate(deal.start_on)) {
                    if (deal.discount_type.toLowerCase() === "flat") {
                        var discount = parseFloat(deal.discount);
                        if (decidedDiscount < discount) {
                            decidedDiscount = discount;
                            self.selectedDeal = deal;
                        }
                    }
                    if (deal.discount_type.toLowerCase() === "percent") {
                        let discount: any = self.getNumber(parseFloat(deal.discount) * parseFloat(subTotal) / 100, 2);
                        discount = parseFloat(discount);
                        if (decidedDiscount < discount) {
                            decidedDiscount = discount;
                            self.selectedDeal = deal;
                        }
                    }
                }
            }
        });
        return self.selectedDeal;
    };

    getNumber(num, decimal) {
        let afterDecimal = (num + "").split(".");
        if (!_.isEmpty(afterDecimal[1]) && afterDecimal[1].length > 5) {
            num = Math.round(num * 100) / 100;
        }
        let reg: any = new RegExp('^\\d+(?:\\.\\d{0,' + decimal + '})?');
        let number: any = Number(parseFloat(num).toString().match(reg));
        return parseFloat(number).toFixed(decimal);
    }
    ngOnDestroy() {
        if (this.onCartChange$Subscription) {
            this.onCartChange$Subscription.unsubscribe();
        }
    }

    getDateSlot(type) {
        let workingDates = [];
        let _currentRes = this.globals.currentRestaurantDetail;
        if (_currentRes) {
            if (_currentRes.all_delivery_working_days || _currentRes.all_takeout_working_days) {
                var dates = _currentRes.all_delivery_working_days;
                if (type !== 'delivery') {
                    dates = _currentRes.all_takeout_working_days;
                }
                $.each(dates, function (key, value) {
                    var dateObj = {
                        text: value,
                        value: key
                    };
                    workingDates.push(dateObj);
                });
            }
        }
        return workingDates;
    }


    editRenderDateTime(orderType: any): void {
        let restId = this.globals.globalRestaurantId;
        let timeslots = this.getDateSlot(orderType);


        if (timeslots.length > 0) {
            var date = this.getStorage('delivery_order_date_' + restId) ? this.getStorage('delivery_order_date_' + restId) : '';
            var time = this.getStorage('delivery_order_time_' + restId) ? this.getStorage('delivery_order_time_' + restId) : '';
            //var hours = $rootScope.currentRestaurant.delivery_hours;
            if (orderType == 'takeout') {
                date = this.getStorage('takeout_order_date_' + restId) ? this.getStorage('takeout_order_date_' + restId) : '';
                time = this.getStorage('takeout_order_time_' + restId) ? this.getStorage('takeout_order_time_' + restId) : '';
                $('#t_delivery').removeAttr("checked");
                $('#t_takeout').prop('checked', 'checked');
                //hours = $rootScope.currentRestaurant.takeout_hours;
            } else {
                $('#t_takeout').removeAttr("checked");
                $('#t_delivery').prop('checked', 'checked');
            }

            this.globals.order_type = orderType;

            this.order_type = orderType;

            var firstSlot = _.first(timeslots);
            date = firstSlot.value;

            this.getDefaultTimeSlots(restId, orderType, date)
                .subscribe((data) => {
                    this.prepareTimeSlot(data);
                });


            this.getOperationsSlotsFun(date);
            this.cartCalution();
        }
    };

    renderDateTime(orderType: any): void {
        let restId = this.globals.globalRestaurantId;
        let timeslots = this.getDateSlot(orderType);


        if (timeslots.length > 0) {
            var date = this.getStorage('delivery_order_date_' + restId) ? this.getStorage('delivery_order_date_' + restId) : '';
            var time = this.getStorage('delivery_order_time_' + restId) ? this.getStorage('delivery_order_time_' + restId) : '';
            //var hours = $rootScope.currentRestaurant.delivery_hours;
            if (orderType == 'takeout') {
                date = this.getStorage('takeout_order_date_' + restId) ? this.getStorage('takeout_order_date_' + restId) : '';
                time = this.getStorage('takeout_order_time_' + restId) ? this.getStorage('takeout_order_time_' + restId) : '';
                $('#t_delivery').removeAttr("checked");
                $('#t_takeout').prop('checked', 'checked');
                //hours = $rootScope.currentRestaurant.takeout_hours;
            } else {
                $('#t_takeout').removeAttr("checked");
                $('#t_delivery').prop('checked', 'checked');
            }

            this.globals.order_type = orderType;
            this.globals.date = date;
            this.globals.time = time;

            this.globals.selectedDate = (date == '') ? timeslots[0].value : date;
            this.globals.selectedTime = time;
            this.globals.dates = timeslots;
            this.globals.timeEdit = false;
            this.date = date;
            this.time = time;
            this.selectedDate = (date == '') ? timeslots[0].value : date;;
            this.selectedTime = time;
            this.dates = timeslots;
            this.timeEdit = false;
            this.order_type = orderType;

            //$rootScope.hours=hours;
            // if (typeof date != "undefined" && typeof time != "undefined" && !_.isEmpty(date) && !_.isEmpty(time)) {
            //     this.globals.timeEdit = true;
            //     this.timeEdit = true;
            // } else {
            this.globals.timeEdit = true;
            this.timeEdit = true;
            if (date == '' || date == "undefined") {
                var firstSlot = _.first(timeslots);
                date = firstSlot.value;
            }
            this.getDefaultTimeSlots(restId, orderType, date)
                .subscribe((data) => {
                    this.prepareTimeSlot(data);
                });
            //}
            // if (date == '' || date == "undefined") {
            //         var firstSlot = _.first(timeslots);
            //         date = firstSlot.value;

            //     }
            this.date = date;
            this.getOperationsSlotsFun(date);
            this.cartCalution();
        }
    };
    getOperationsSlotsFun(d) {
        let restId = this.globals.globalRestaurantId;
        this.getOperationsSlots(restId, d).subscribe((data) => {
            var slots = data.delivery;
            if (slots == '') {
                slots = data.reservation;
            }
            this.globals.cartTimeEdit = slots.toString(", ");
            this.globals.onCart();
        })

    }

    prepareTimeSlot(data: any) {
        let self = this;
        var times = data.timeslots,
            time = _.first(times);
        let restId = this.globals.globalRestaurantId;
        var datekey = this.order_type === 'delivery' ? 'delivery_order_date_' + restId : 'takeout_order_date_' + restId;
        var timekey = this.order_type === 'delivery' ? 'delivery_order_time_' + restId : 'takeout_order_time_' + restId;
        self.setStorage(datekey, this.date);
        self.setStorage(timekey, time);
        self.timeEdit = true;
        self.renderTimeSlots(data.timeslots, self.order_type);
    }

    renderTimeSlotsNoHtml(data, orderType) {
        let self = this;
        let options = '';
        let notSelected = "";
        var resId = self.globals.globalRestaurantId;

        options = notSelected + options;
        if (orderType === 'takeout') {
            self.setStorage('takeout_order_time_' + resId, '');
        } else {
            self.setStorage('delivery_order_time_' + resId, '');
        }

        self.globals.cartTime = data;
        // console.log(self.globals.cartTime);
        self.globals.onCart();
        //$('.t-order-time').html(options);
    };

    renderTimeSlots(data, orderType) {
        let self = this;
        let options = '';
        let notSelected = "";
        var resId = self.globals.globalRestaurantId;

        var selected = self.getStorage('delivery_order_time_' + resId) ? self.getStorage('delivery_order_time_' + resId) : '';
        if (orderType === 'takeout') {
            selected = self.getStorage('takeout_order_time_' + resId) ? self.getStorage('takeout_order_time_' + resId) : '';
        }
        if (selected === '') {
            options += '<option value="">Select Time</option>';
        }

        _.each(data, function (item) {
            var select = '';
            if (item == selected) {
                select = ' selected';
                notSelected = select;
            }

            options += '<option value="' + item + '"' + select + '>' + self.get12HourTime(item) + '</option>';
        });
        if (notSelected === '') {
            if (selected !== '') {
                notSelected = '<option value="">Select Time</option>';
            }
            options = notSelected + options;
            if (orderType === 'takeout') {
                self.setStorage('takeout_order_time_' + resId, '');
            } else {
                self.setStorage('delivery_order_time_' + resId, '');
            }
        }
        self.globals.cartTime = options;
        // console.log(self.globals.cartTime);
        self.globals.onCart();
        //$('.t-order-time').html(options);
    };

    getFormattedDateText(date) {
        let self = this;
        var tempDate = this.parseDate(date);
        var tempDate2 = this.parseDate(self.globals.currentRestaurantDetail.current_dateTime);
        if (tempDate.getDate() === tempDate2.getDate()) {
            return 'Today';
        } else {
            return this.weekdays[tempDate.getDay()] + ", " + this.months[tempDate.getMonth()] + " " + tempDate.getDate();
        }
    }

    getCheckTakeout() {
        let self = this;
        var restId = self.globals.globalRestaurantId;
        self.setStorage('order_type_' + restId, 'takeout');
        self.setStorage("select_delivery_" + restId, 'takeout');
        $("#t_delivery").prop("checked", false);
        $('#t_takeout').prop("checked", true);
        self.globals.deliveryOrderCart = false;
        self.globals.onCart();
        self.renderDateTime('takeout');
        self.hidePopUp();
        if (self.getStorage('addtoOrder_' + restId) && self.getStorage('addtoOrder_' + restId) !== '') {
            self.setStorage('addtoOrder_' + restId, '');
        }
        if (self.getStorage('select_delivery_' + restId) && self.getStorage('select_delivery_' + restId) !== '') {
            self.setStorage('select_delivery_' + restId, '');
        }
        // ga('send', 'event', 'Order Summary', "Order Takeout" , "Click_on_order_takeout_Button", 1, true);
    }

    facebookRegister() {
        var returnUrl = window.location.host;
        var host = window.location.host;
        var protocol = window.location.protocol;
        host = protocol + '//' + host;
        var loginURL = this.getApiUrl('user/login/fb?token=' + this.getStorage('oauth.token') + '&return_url=' + host + '&host_name=' + host);
        var l = (screen.width / 2) - 300;
        var t = (screen.height / 2) - 200;
        window.open(loginURL, 'facebook-login', 'scrollbars=no, resizable=no, width=600, height=400, top=' + t + ', left=' + l);
    };
    googlePlusRegister() {
        var returnUrl = window.location.host;
        var host = window.location.host;
        var protocol = window.location.protocol;
        host = protocol + '//' + host;
        var loginURL = this.getApiUrl('user/login/google?token=' + this.getStorage('oauth.token') + '&return_url=' + host + '&host_name=' + host);
        var l = (screen.width / 2) - 300;
        var t = (screen.height / 2) - 200;
        window.open(loginURL, 'googlelogin', 'scrollbars=no, resizable=no, width=600, height=400, top=' + t + ', left=' + l);
    };
    twitterRegister() {
        var self = this;
        //var returnUrl = window.location.host;
        var host = window.location.host;
        var protocol = window.location.protocol;
        host = protocol + '//' + host;
        var loginURL = this.getApiUrl('user/login/twitter?token=' + this.getStorage('oauth.token') + '&return_url=' + host + '&host_name=' + host);
        var l = (screen.width / 2) - 300;
        var t = (screen.height / 2) - 200;
        window.open(loginURL, 'twitter-login', 'scrollbars=no, resizable=no, width=600, height=400, top=' + t + ', left=' + l);
    };
    validateEmailNow(input, output) {
        var hasError = false,
            email = $("#" + input),
            error = $("." + output);
        var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        if ($.trim(email.val()) === "") {
            error.removeClass("hide").html('Hey, you forgot something');
            hasError = true;
        } else {
            if (!emailFormat.test($.trim(email.val()))) {
                error.removeClass("hide").html('That don\'t look like any e-mail I ever seen. Maybe the "@" or the "." are in the wrong spot. This isn\'t cubism, put things where they belong!');
                hasError = true;
            } else {
                error.addClass("hide");
            }
        }
        return hasError;
    };

    forgotPass(data) {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'user/forgot-password/1';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.put(apiUrl, data, options)
            .map((response: Response) => <any>response.json());

    }
    validatePassword(input, output) {
        var hasError = false,
            pass = $("#" + input), error = $("." + output),
            passVal = pass.val();
        if (passVal === '') {
            error.html("Whoa now, we can't let you go without a password.").fadeIn("slow").removeClass("hide");
            hasError = true;
        } else if (passVal.length < 6) {
            error.html('You need to use at least 6 characters. Try making it a personal catchphrase. Like yabadabadoo. But not that. Seriously Don\'t.').fadeIn("slow").removeClass("hide");
            hasError = true;
        } else {
            error.html("").fadeOut("slow").addClass("hide");
        }
        return hasError;
    };

    login(data) {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'user/login';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
    }
    getCapcha() {
        let self = this;
        let apiUrl = self.getApiUrl('user/captcha');
        return self._http.get(apiUrl)
            .map((response) => <any>response.json());

    }

    validateField(input, output) {
            var hasError = false,
                    field = $("#" + input),
                    error = $("." + output);
            if ($.trim(field.val()) === "") {
                error.removeClass("hide").html('Hey, you forgot something');
                hasError = true;
            }
            return hasError;
        };

    newRegister(data) {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'user/details';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
    }
    getPointDetails(task) {
        let self = this;
        let apiUrl = self.getApiUrl('user/point-detail?type=' + task);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getOrderlist(task,restId) {
        let self = this;
        let apiUrl = self.getApiUrl('user/order?restaurantid='+restId+'&type=' + task);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    } 
    getOrderDetails(id){
        let self = this;
        let apiUrl = self.getApiUrl('user/order/'+id+'?type=order');
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    getReOrderDetails(id){
        let self = this;
        let apiUrl = self.getApiUrl('user/reorder/'+id);
        return self._http.get(apiUrl)
            .map((response: Response) => <any>response.json());
    }
    validatePhoneR() {
            var hasError = false,
                    phoneNo = $("input[name=phone_no_r]"),
                    phoneVal = $.trim(phoneNo.val().replace(/([*()'-\/ ])/g, ''));
            if (phoneVal === '') {
                $(".y_error_phone").html("We promise; No prank calls").fadeIn("slow").removeClass("hide");
                hasError = true;
            } else if (phoneVal.length < 10) {
                $(".y_error_phone").html('You know, there\'s a cadence to phone numbers. They usually go xxx-xxx-xxxx').fadeIn("slow").removeClass("hide");
                hasError = true;
            } else {
                $(".y_error_phone").html("").fadeOut("slow").addClass("hide");
            }
            return hasError;
        };
     
     get24HourTime(time) {
            var date = this.parseDate('1970-01-01 ' + time);
            return this.paddLeft(date.getHours(), 0, 2) + ":" + this.paddLeft(date.getMinutes(), 0, 2);
        };
    newReservation(data) {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'restaurant/reservation';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
    }       
    reserveTableNow(rDate) {
            let self = this;
            var host = window.location.host;
            var restId = self.globals.globalRestaurantId;
            var resData =self.globals.currentRestaurantDetail;
            var reserve_seat = $("#people").val(),
                    date = rDate,
                    time = $("#timepicker1").val(),
                    firstName = $("input[name=first_name_r]"),
                    lastName = $("input[name=last_name_r]"),
                    phoneNo = $("input[name=phone_no_r]"),
                    email = $("input[name=email_r]"),
                    instructions = [];
            $("input[name='instructions[]']:checked").each(function () {
                instructions.push($(this).val());
            });
            if ($(".own_instruction").val() !== '') {
                instructions.push($(".own_instruction").val());
            }
            var hasError = this.validateField('first_name_r', 'new-location-msg'),
                    hasError1 = this.validatePhoneR(),
                    hasError2 = this.validateEmailNow('email_r', 'reservationdata_email_r');
            if (hasError || hasError1 || hasError2) {
                var top = $(".error-message:not(.hide):first").offset().top;
                $(".a_modal-dialog").stop().animate({
                    scrollTop: top
                });
                $('#btnconfirm').removeClass('disabled');
                $('.r_confirm_loader').addClass('hide');
                return false;
            }
            $('.r_confirm_loader').removeClass('hide');
            $('.popup_reservetable').addClass('form_disable');
            var data = {
                'restaurant_id': resData.id,
                'restaurant_name': resData.name,
                'date': date,
                'time': this.get24HourTime(time),
                'time_slot': date + " " + this.get24HourTime(time),
                'reserved_seats': reserve_seat,
                'first_name': $.trim(firstName.val()),
                'last_name': $.trim(lastName.val()),
                'phone': $.trim(phoneNo.val().replace(/([*()'-\/ ])/g, '')),
                'email': $.trim(email.val()),
                'user_instruction': instructions.join("||"),
                'token': self.getStorage('oauth.token'),
                "restshortkey": self.globals.globalThemeSortKey,
                "host_name": host
            };
            console.log(data);
            var dt = this.parseDate(date);
            var dayArray = ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'];
            var day = dayArray[dt.getDay()];
            var monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var bookDate = dt.getDate();
            var month = monthArray[dt.getMonth()];
            var year = dt.getFullYear();
            var msgtoSendFriend = $.trim(firstName.val()) + " sent you an invitation to dine at " + resData.name + " " + resData.address + " on " + day + ', ' + month + ' ' + bookDate + ', ' + year + " at " + time + ". Drinks will be drank, eats will be eaten, and good times will be had by all. That's the plan anyway.";
            $('.y-expectedTime').html(day + ', ' + month + ' ' + bookDate + " at " + this.get12HourTime(time));
            self.newReservation(data).subscribe((res)=>{
                 if (res['reservation_status'] == 1) {

                            $('.formstep2').addClass('hide');
                            $('.formstep2').addClass('hide');
                            $('.formstep3').removeClass('hide');
                            $('#y-party-size').html(reserve_seat);
                            $('.y-reserve-date').html(date);
                            $('.y-reserve-time').html(time);
                            $('.y-recieptN').html(data['receipt_no']);
                            $('#y-reservation-id').val(data['reservation_id']);
                            $('#send-reservation-msg').text(msgtoSendFriend);
                             var rtime = date + " " + time;
                        $("#calendarClick-1").attr("data-id", res.reservation_id)
                        .attr("data-starttime",rtime)
                        .attr("data-endtime", rtime)
                        .attr("data-title", "Reservation in "+resData.name)
                        .attr("data-description", "Reservation in "+resData.name+" for "+reserve_seat)
                        .attr("data-location", resData.address+", "+resData.city+", "+resData.zipcode);
                            //ga('send', 'event', 'Reserve a Table', "Request Reservation", "Click_on_request_reservation_Button", 1, true);
                        } else {
                            $('#btnconfirm').removeClass('disabled');
                            $('.popform.bookform').removeClass('disabledform');

                            $('.error_time_slot').empty().html(data['msg']);
                            $('.error_time_slot').removeClass('hide');
                        }
            });
            $('.r_confirm_loader').addClass('hide');
            $('.popup_reservetable').removeClass('form_disable');
        };
        validateAddress1() {
            var hasError = false,
                    address1 = $("input[name=address_1]");
            if ($.trim(address1.val()) === "") {
                address1.closest("div").find(".error-message").removeClass("hide");
                hasError = true;
            } else {
                address1.closest("div").find(".error-message").addClass("hide");
            }
            return hasError;
        };
        validateShippingZipCode() {
            var hasError = false,
                    zipCode = $("input[name=zipcode]");
                    $.trim(zipCode.val().replace(/([*()'-\/ ])/g, ''));
            if (zipCode.val() === '') {
                zipCode.closest("div").find(".error-message").removeClass("hide").html('Come on, you gave us all the other info. Why you holding out?');
                hasError = true;
            } else {
                zipCode.closest("div").find(".error-message").addClass("hide");
                zipCode.closest("div").find(".error-message1").addClass("hide");
            }
            return hasError;
        };
        validateFirstName() {
            var hasError = false;
            var firstName = $("input[name=first_name]");
            var errorMessage = firstName.closest("div").find(".error-message");
            if ($.trim(firstName.val()) === "") {
                errorMessage.removeClass("hide");
                hasError = true;
            } else {
                errorMessage.addClass("hide");
            }
            var value = $.trim(firstName.val());
            $("input[name=first_name]").val(value);
            return hasError;
        }
        validatePhone() {
            var hasError = false,
                    phoneNo = $("input[name=phone_no]"),
                    phoneVal = $.trim(phoneNo.val().replace(/([*()'-\/ ])/g, ''));
            if (phoneVal === '') {
                $(".error-phoneNo").html("We promise; No prank calls").fadeIn("slow").removeClass("hide");
                hasError = true;
            } else if (phoneVal.length < 10) {
                $(".error-phoneNo").html('You know, there\'s a cadence to phone numbers. They usually go xxx-xxx-xxxx').fadeIn("slow").removeClass("hide");
                hasError = true;
            } else {
                $(".error-phoneNo").html("").fadeOut("slow").addClass("hide");
            }
            return hasError;
        };
        validateEmail() {
            var hasError = false,
                    email = $("input[name=email]");
            var emailFormat = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

            if ($.trim(email.val()) === "") {
                email.closest("div").find(".error-message").removeClass("hide").html('Hey, you forgot something');
                hasError = true;
            } else {
                if (!emailFormat.test(email.val())) {
                    email.closest("div").find(".error-message").removeClass("hide").html('That don\'t look like any e-mail I ever seen. Maybe the "@" or the "." are in the wrong spot. This isn\'t cubism, put things where they belong!');
                    hasError = true;
                } else {
                    email.closest("div").find(".error-message").addClass("hide");
                }
            }
            return hasError;
        };
        validateCardName() {
            var hasError = false,
                    cardName = $("input[name=card_name]");

            if ($.trim(cardName.val()) === "") {
                cardName.closest("div").find(".error-message").removeClass("hide");
                hasError = true;
            } else {
                cardName.closest("div").find(".error-message").addClass("hide");
            }
            return hasError;
        };
        validateCardNumber() {
            var hasError = false,
                    cardNumber = $("input[name=card_number]");
            if ($.trim(cardNumber.val()) === "") {
                cardNumber.closest("div").find(".error-message").removeClass("hide").html('Try rubbing your fingers over the numbers, that helps us get \'em right');
                hasError = true;
            } else {
                if (!this.isValidCardNumber(cardNumber)) {
                    cardNumber.closest("div").find(".error-message").removeClass("hide").html("We need all of the numbers on the card. All of \'em");
                    hasError = true;
                } else {
                    cardNumber.closest("div").find(".error-message").addClass("hide");
                }
            }
            return hasError;
        };
        getCardType(card_no) {
            var card_number = card_no.replace(/ /g, '');
            try {
                var intCardNumber4 = parseInt(card_number.substr(0, 4), 10);
                var intCardNumber6 = parseInt(card_number.substr(0, 6), 10);
                var strCardNumber = card_number + "";
            } catch (ex) {
                var intCardNumber4 = 0;
                var intCardNumber6 = 0;
                var strCardNumber = "";
            }
            var isVISA = (new RegExp("^4.*")).test(strCardNumber);
            var isMASTER = (new RegExp("^(51|52|53|54|55).*")).test(strCardNumber);
            var isAMEX = (new RegExp("^(34|37).*")).test(strCardNumber);
            var isDISC = (((new RegExp("^(6011|644|645|646|647|648|649|65).*")).test(strCardNumber)) || (intCardNumber6 > 622127 && intCardNumber6 < 622925));
            var isDINN = (new RegExp("^(54|36|38|300|301|302|303|304|305).*")).test(strCardNumber);
            var isJCB = intCardNumber4 >= 3528 && intCardNumber4 <= 3589;
            if (isVISA) {
                return "visa";
            }
            if (isMASTER) {
                return "master";
            }
            if (isAMEX) {
                return "amex";
            }
            if (isDISC) {
                return "disc";
            }
            if (isDINN) {
                return "dinn";
            }
            if (isJCB) {
                return "jcb";
            }
            return false;
        };
        isValidCardNumber(element) {
            var cardNumber = element.val();
            cardNumber = cardNumber.replace(/ /g, '');
            return cardNumber.length > 13 && cardNumber.length < 19 && this.getCardType(cardNumber);
        };
       validateCVVCode() {
            var hasError = false,
                    cvv = $("input[name=cvv_code]");
            if ($.trim(cvv.val()) === "") {
                cvv.closest("div").find(".error-message").removeClass("hide").html('It would be irresponsible of us not to require this.');
                hasError = true;
            } else {
                if (!this.isValidCVVCode(cvv)) {
                    cvv.closest("div").find(".error-message").removeClass("hide").html("Hmm, that\'s not it. Try looking a little closer at the card  or maybe your card  number is wrong.");
                    hasError = true;
                } else {
                    cvv.closest("div").find(".error-message").addClass("hide");
                }
            }
            return hasError;
        };
        isValidCVVCode(element) {
            var cvvCode = element.val();
            return (isNaN(cvvCode) === true || cvvCode.length < 3 || cvvCode.length > 4) ? false : true;
        };
        validateZipCode() {
            var hasError = false;
            var zip = $("input[name=zip]");
            if ($.trim(zip.val()) === "") {
                zip.closest("div").find(".error-message").removeClass("hide");
                hasError = true;
            } else if ($.trim(zip.val()).length < 5) {
                zip.closest("div").find(".error-message").removeClass("hide").html('Billing zip should be 5 digits.');
                hasError = true;
            } else {
                zip.closest("div").find(".error-message").addClass("hide");
                hasError = false;
            }
            return hasError;
        };
        validateMonth() {
            var hasError = false;
            var month = $('.card_expire_month').val();
            var year = $('.card_expire_year').val();
            var currentDateObj = new Date();
            var currentMonth = currentDateObj.getMonth() + 1;
            var currentYear = currentDateObj.getFullYear();
            if (year == currentYear) {
                if (month < currentMonth) {
                    $('.card-validity').removeClass("hide");
                    hasError = true;
                } else {
                    $('.card-validity').addClass("hide");
                }
            } else {
                $('.card-validity').addClass("hide");
            }
            return hasError;
        };
        getFormattedItems() {
            var items = [],i=0;
            let self=this;
            var restId = this.globals.globalRestaurantId;
            
            $.each(JSON.parse(self.getStorage('order_items_' + restId)), function (key, value) {
                items.push({
                    id: i,
                    item_id: value['item_id'],
                    quantity: value['quantity'],
                    price_id: value['price_id'],
                    special_instruction: value['special_instruction'],
                    addons: value['addons']
                });
                i+=1;
            });
            return items;
        };
        newOrder(data) {
        let self = this;
        let apiUrl = self.globals.apiBaseUrl + 'restaurant/place-order';
        let headers = new Headers();
        headers.append('content-type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return self._http.post(apiUrl, data, options)
            .map((response: Response) => <any>response.json());
      } 
        placeOrder(ref) {
            var self=this;
            var host = window.location.host;
            var restId = self.globals.globalRestaurantId;
            var resData =self.globals.currentRestaurantDetail;
            var firstName = $("input[name=first_name]"),
                    lastName = $("input[name=last_name]"),
                    address1 = $("input[name=address_1]"),
                    address2 = $("input[name=address_2]"),
                    city = $("input[name=city]"),
                    stateCode = $("input[name=state_code]"),
                    phoneNo = $("input[name=phone_no]"),
                    email = $("input[name=email]"),
                    cardName = $("input[name=card_name]"),
                    cardNumber = $("input[name=card_number]"),
                    cvv = $("input[name=cvv_code]"),
                    zip = $("input[name=zip]"),
                    month = $(".card_expire_month"),
                    year = $(".card_expire_year"),
                    zipCode = $("input[name=zipcode]").val(),
                    instructions = [];
            $("input[name='instructions[]']:checked").each(function () {
                instructions.push($(this).val());
            });
            if ($(".own_instruction").val() !== '') {
                instructions.push($(".own_instruction").val());
            }
            var deliveryDate = self.getStorage("takeout_order_date_" + restId);
            var deliveryTime = self.getStorage("takeout_order_time_" + restId);
            let address_lat:any = 0, combinedAddress:any = '', address_lng:any = 0, tipPercent:any = 0, tipAmount:any = 0;
         
            if (self.getStorage('order_type_' + restId) === "delivery") {
                address1 = $("input[name=address_1]").val();
                address2 = $("input[name=address_2]").val();
                city = $("input[name=city]").val();
                stateCode = $("input[name=state_code]").val();
                address_lat = self.getStorage("address_lat_" + restId);
                address_lng = self.getStorage("address_lng_" + restId);
                combinedAddress = (address2) ? address1 + ", " + address2 : address1;
                deliveryDate = self.getStorage("delivery_order_date_" + restId);
                deliveryTime = self.getStorage("delivery_order_time_" + restId);
                self.validateAddress1();
                self.validateShippingZipCode();
                tipPercent = self.getStorage("tip_" + restId);
                tipAmount = self.getStorage("order_tip_" + restId);
            } else {
                city = "";
                address1 = "";
                address2 = "";
                stateCode = "NY";
                zipCode = "";
                combinedAddress = "";
            }
            var hasError = this.validateFirstName(),
                    hasError1 = this.validatePhone(),
                    hasError2 = this.validateEmail(),
                    hasError3 = this.validateCardName(),
                    hasError4 = this.validateCardNumber(),
                    hasError5 = this.validateCVVCode(),
                    hasError6 = this.validateZipCode(),
                    hasError7 = this.validateMonth();
            if (!ref.showPayment) {
                hasError3 = false;
                hasError4 = false;
                hasError5 = false;
                hasError6 = false;
                hasError7 = false;
            }
            if (hasError || hasError1 || hasError2 || hasError3 || hasError4 || hasError5 || hasError6 || hasError7) {
                var top = $(".error-message:not(.hide):first").offset().top - 200;
                $("html,body").stop().animate({scrollTop: top});
                return false;
            }
            var redeem_point = 0;
            if (this.globals.currentUser['points'] >= self.minRedemption) {
                redeem_point = ref.pointRedeem;
                var remainingPoint = (this.globals.currentUser['points']) - ref.pointRedeem;
                if (remainingPoint < 0) {
                    remainingPoint = 0;
                }
                this.globals.currentUser['points'] = remainingPoint;
            }
            var orderDetailsObj = {
                'restaurant_id': restId,
                'delivery_address': combinedAddress,
                'delivery_time': deliveryTime,
                'delivery_date': deliveryDate,
                'special_instruction': instructions,
                'own_instruction': $(".own_instruction").val(),
                'order_type': self.getStorage("order_type_" + restId),
                'email': email.val(),
                'order_type1': 'I',
                'order_type2': "P",
                'discount': "",
                'discount_type': "",
                'tip_percent': tipPercent,
                'tax': self.getStorage("order_tax_" + restId),
                'items': self.getFormattedItems(),
                'user_comments': "",
                'restshortkey': self.globals.globalThemeSortKey,
                'payViaCard': ref.payViaCard,
                'payViaPoint': ref.payViaPoint,
                'redeem_point': redeem_point
            };
            var userDetailsObj = {
                'fname': $.trim(firstName.val()),
                'lname': $.trim(lastName.val()),
                'email': email.val(),
                'city': $.trim(city),
                'apt_suit': $.trim(address2),
                'address': $.trim(address1),
                'phone': phoneNo.val().replace(/([*()'-\/ ])/g, ''),
                'state_code': $.trim(stateCode),
                'zipcode': $.trim(zipCode),
                'address_lat': address_lat,
                'address_lng': address_lng,
                'redeem_point': redeem_point
            };
            var cardDetails = {
                'card_type': this.getCardType(cardNumber.val()) || "Unknown",
                "card_no": cardNumber.val().replace(/ /g, ''),
                "expiry_month": month.val(),
                "expiry_year": year.val(),
                "name_on_card": cardName.val(),
                "cvc": cvv.val(),
                "billing_zip": zip.val()
            };
            //console.log($rootScope.user_address_id);
            var data = {
                user_details: userDetailsObj,
                card_details: cardDetails,
                order_details: orderDetailsObj,
               // user_address_id:$rootScope.user_address_id,
                user_address_id:'',
                order_pass_through: 0,
                reservation_details: {},
                token: self.getStorage('oauth.token'),
                host_name: host ? host : ''
            };
            // if ($rootScope.selectedDeal) {
            //     data["deal_id"] = $rootScope.selectedDeal.id;
            // }
            data["promocode"] = '';
            if (self.getStorage("promocode_status") === "valid") {
                data["promocode"] = self.getStorage("promocode");
            }
            $('.placemyorder').addClass('disabled');
            $('#menu').addClass('form_disable');
            $('.confirm_loader').removeClass('hide');
            $('.t-edit_order_link').addClass('hide');
            
            self.newOrder(data).subscribe((res)=>{
                            this.router.navigate(['/payment']);
                            
                            //$rootScope.orderReceipt=res.receipt;
                            
            },(err)=>{
                let errObj = JSON.parse(err._body);
                 let msg = errObj.error;
                 $('.placemyorder').removeClass('disabled');
                            $('.confirm_loader').addClass('hide');
                            $('#menu').removeClass('form_disable');
                            $(".stripe-error").html(msg);
                            $(".stripe-error").closest('.row').removeClass("hide"); 
                $('.register_loader').addClass('hide');
            })
        }

}
