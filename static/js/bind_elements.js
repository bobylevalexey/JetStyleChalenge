function Element(data){
	this.title = ko.observable(data.title);
	this.price = ko.observable(data.price);
	this.count = ko.observable(data.count);
	this.sum = ko.computed(function(){
		return Number(this.price()) * Number(this.count());
	}, this);
}

function PageModel(){
	var self = this;
	// элементы таблицы
	self.elements = ko.observableArray();
	// новый элемент, для заполнения в форме 
	self.newElement = ko.observable(new Element({title: '', price: '', count: ''}));
	// отвечает за вывод сообщения об ошибке при неправильом заполнении формы
	self.error = ko.observable(false);
	
	// удаление элемента
	self.deleteElement = function(element){
		console.log('hi');
		$.ajax('/delete', {
			type: 'post',
			contentType: 'application/json',
			data: ko.toJSON({title:element.title}),
			success: function (result){
				if (result){
					self.error(false);
					self.elements.remove(element);
				} else {
					self.error(true);
				}
			}
		});
	};
	
	// добавление нового элемента
	self.addElement = function (){
		$.ajax('/add', {
			type: 'post',
			contentType: 'application/json',
			data: ko.toJSON({
				title: self.newElement().title,
				price: self.newElement().price,
				count: self.newElement().count,
			}),
			success: function (result){
				if (result){
					self.error(false);
					self.elements.push(self.newElement());
					self.newElement(new Element({title: '', price: '', count: ''}));
				} else {
					self.error(true);
				}
			}
		})
	};
	
	// инициализация таблицы
	$.getJSON("/init", function(allData) {
        self.elements($.map(allData, function(item) { 
			return new Element(item) 
		}));
    }); 
}

ko.applyBindings(new PageModel());