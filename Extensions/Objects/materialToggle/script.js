
var template_path = Qva.Remote + "?public=only&name=Extensions/materialToggle/";
Qva.LoadCSS(template_path + "materialToggle.css");
Qv.AddExtension("materialToggle",
        function () {
		 var _this = this;
		 var html="";
		 var size=this.Layout.Text1.text ? this.Layout.Text1.text : 'large';
		 size=size.toLowerCase();
		 var color=this.Layout.Text2.text ? this.Layout.Text2.text : 'teal';
		 var text=this.Layout.Text3.text ? this.Layout.Text3.text : '';
		_this.materialToggle = {};
		_this.materialToggle.UniqueId = this.Layout.ObjectId.replace("\\", "_");
		_this.materialToggle.VariableName =this.Layout.Text0.text ? this.Layout.Text0.text : ' ';
		_this.materialToggle.ExtensionLoaded = false;
		_this.materialToggle.ExtensionName = "materialToggle";
		_this.materialToggle.CurrentValue="";
		
		 Extension_Load();
		 $(_this.Element).empty();
		
		 
		function Extension_Load() {
			RetrieveSettings(function () {
				RenderExtension();
				_this.materialToggle.ExtensionLoaded = true;
			});
        }
		
		function RetrieveSettings(fnCallBack) {
            RetrieveInitVarValue(fnCallBack);
        }
		
		function RetrieveInitVarValue(fnCallBack) {
			var qvDoc = Qv.GetCurrentDocument();
			qvDoc.GetAllVariables(function (vars) {
				if (vars != null) {
					for (var i = 0; i < vars.length; i++) {
						var obj = vars[i];
						if ((obj.isreserved == "false") && (obj.isconfig == "false")) {
							if (obj.name.toLowerCase() == _this.materialToggle.VariableName.toLowerCase()) {
								if (obj.value == "true" || obj.value == "1" || obj.value == "false" || obj.value == "0") {
									switch (obj.value.toString().toLowerCase()) {
										case "true":
										case "1":
											_this.materialToggle.CurrentValue = 1;
											break;
										case "false":
										case "0":
											_this.materialToggle.CurrentValue = 0;
											break;
									}
									fnCallBack();
									return;
								}
							}
						}
					}
				}
			});
			fnCallBack();
        }
			
		function RenderExtension() {
			html="";
			$(_this.Element).empty();
			html+='<table style="margin-top:15px;"><tr><td>';
				
			switch(size){
				case 'small':
					html+='<h4 style="margin-top:2px;margin-bottom:2px;">'+text+'</h4></td>';
				break;
				case 'medium':
					html+='<h3 style="margin-top:4px;margin-bottom:4px;">'+text+'</h3></td>';
				break;
				case 'large':
					html+='<h2 style="margin-top:6px;margin-bottom:6px;">'+text+'</h2></td>';
				break;
			}
			
			html+= '<td><div class="onoffswitch '+size+'">';
			if(_this.materialToggle.CurrentValue==1)
			{
				html+='<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox '+size+' '+color+'" id="myonoffswitch '+GetUniqueId()+'" checked>';
			}else{
				html+='<input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox '+size+' '+color+'" id="myonoffswitch '+GetUniqueId()+'">';	
			}
			html+='<label class="onoffswitch-label '+size+' '+color+'" for="myonoffswitch '+GetUniqueId()+'" id="switchIt'+GetUniqueId()+'"></label></td></tr></table>';
			_this.Element.innerHTML=html;
			html="";
			$('#switchIt'+GetUniqueId()).click(function () {
				SetValue();
			});
			
		}
			
			
			
		//Set the value for the variable
		function SetValue() {
			var qvDoc = Qv.GetCurrentDocument();
			switch(_this.materialToggle.CurrentValue) {
				case 1:
					_this.materialToggle.CurrentValue=0;
					break;
				case 0:
					_this.materialToggle.CurrentValue=1;
					break;
			}
			qvDoc.SetVariable(_this.materialToggle.VariableName, _this.materialToggle.CurrentValue);
		}
		
		function GetUniqueId() {
			return _this.materialToggle.UniqueId;
		}


 });
 
 
 //This is needed for the dropdown boxes (HMTL selects) to work
if (Qva.Mgr.mySelect == undefined) {
    Qva.Mgr.mySelect = function (owner, elem, name, prefix) {
        if (!Qva.MgrSplit(this, name, prefix)) return;
        owner.AddManager(this);
        this.Element = elem;
        this.ByValue = true;
 
        elem.binderid = owner.binderid;
        elem.Name = this.Name;
 
        elem.onchange = Qva.Mgr.mySelect.OnChange;
        elem.onclick = Qva.CancelBubble;
    }
    Qva.Mgr.mySelect.OnChange = function () {
        var binder = Qva.GetBinder(this.binderid);
        if (!binder.Enabled) return;
        if (this.selectedIndex < 0) return;
        var opt = this.options[this.selectedIndex];
        binder.Set(this.Name, 'text', opt.value, true);
    }
    Qva.Mgr.mySelect.prototype.Paint = function (mode, node) {
        this.Touched = true;
        var element = this.Element;
        var currentValue = node.getAttribute("value");
        if (currentValue == null) currentValue = "";
        var optlen = element.options.length;
        element.disabled = mode != 'e';
        for (var ix = 0; ix < optlen; ++ix) {
            if (element.options[ix].value === currentValue) {
                element.selectedIndex = ix;
            }
        }
        element.style.display = Qva.MgrGetDisplayFromMode(this, mode);
 
    }
}