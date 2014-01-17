angular.module("Beader.controllers", []).controller("DesignerCtrl", ["$scope", "$http", function($scope, $http){
        top.designerScope = $scope;

        // Palette colors

        $scope.colors = ["000000","002000","003400","006700","009b00","00ce00","00ff00","070707","000035","003333","006731","009b2c","00ce23","00ff10","0e0e0e","000068","003268","006667","009a64","00ce62","00ff5d","151515","00009c","002f9c","00659b","009a9a","00cd98","00ff95","1c1c1c","0000d0","0029cf","0063cf","0099cf","00cccd","00ffcc","232323","0000ff","0021ff","0060ff","0096ff","00cbff","00ffff","2a2a2a","340000","333300","316700","2d9a00","26ce00","1bff00","313131","340034","333333","316731","2d9a2b","26ce22","1aff0f","383838","330068","333268","306666","2d9a64","26ce61","1aff5c","3f3f3f","32009b","332f9c","30649a","2d999a","25cd98","19ff96","464646","3300d0","3129cf","3063cf","2c99cf","24cccd","17ffcb","4d4d4d","3100ff","3021ff","2e60ff","2a96ff","23cbff","15ffff","545454","670000","673300","676700","649a00","62ce00","5fff00","5b5b5b","670033","673332","666730","659a2a","62ce21","5eff0b","626262","670068","673167","666666","649a64","61cd60","5eff5c","696969","67009c","672e9c","66659b","64999a","61cd97","5eff95","707070","6600cf","6729d0","6663cf","6498ce","62cdcd","5dffcb","777777","6700ff","6621ff","655fff","6497ff","61cbff","5dffff","7e7e7e","9b0000","9a3200","9a6700","999a00","98ce00","96ff00","858585","9a0031","9b3230","9a672e","999a28","98ce1e","96ff05","8c8c8c","9b0067","9a3066","9a6665","999a64","97cd60","95ff5b","939393","9b009b","9a2d9a","9a659a","999999","98cd97","95ff94","9a9a9a","9a00cf","9a28cf","9a63cf","9897cd","97cccc","95ffcb","a1a1a1","9a00ff","9a1fff","995fff","9997ff","97cbff","95ffff","a8a8a8","cf0000","cf3200","ce6600","cd9a00","cdce00","cbff00","afafaf","cf002e","ce312d","ce662a","cd9a24","cccd19","cbff00","b6b6b6","ce0065","ce3065","cd6563","cd9962","cccd5e","cbff5a","bdbdbd","ce009a","ce2d9a","cd6499","cd9998","cccc96","cbff94","c4c4c4","ce00cf","ce27ce","ce62ce","cd97cd","cccccc","cbffcb","cbcbcb","ce00ff","ce1eff","cd5fff","cd96ff","cccbff","caffff","d2d2d2","ff0000","ff3000","ff6600","ff9a00","ffce00","ffff00","d9d9d9","ff002a","ff3028","ff6525","ff991e","ffcd0f","ffff00","e0e0e0","ff0064","ff2e64","ff6563","ff9960","ffcd5d","ffff58","e7e7e7","ff0099","ff2b99","ff6398","ff9998","ffcd96","ffff92","eeeeee","ff00ce","ff25ce","ff61cd","ff98cd","ffcccb","ffffc9","f5f5f5","ff00ff","ff1cff","ff5eff","ff96ff","ffcbff","ffffff"];

        // Data

        $scope.data = {};

        // Defaults

        $scope.name = "Untitled Pattern";
        $scope.align = "normal";
        $scope.mode = "brush";
        $scope.color = "000000";
        $scope.clearColor = "ffffff";

        // Set color

        $("#color").css("backgroundColor", "#" + $scope.color);

        $scope.renderPalette = function(){
            var palette = $("#palette")[0];
            var context = palette.getContext("2d");
            
            var width = ($(palette).width() - 1) / 7 - 1;
            var height = ($(palette).height() - 1) / 36 - 1;
            
            for(var y = 0; y < 36; y++){
            
                for(var x = 0; x < 7; x++){
                    
                    context.beginPath();
                    context.fillStyle = "#" + $scope.colors[y * 7 + x];
                    context.fillRect(x * (width + 1), y * (height + 1), width, height);
                    context.strokeStyle = "#ffffff";
                    context.lineWidth = 1;
                    context.stroke();
                
                }
            
            }
        };

        $scope.renderPalette();

        $scope.selectColor = function($event){
                
            var palette = $("#palette")[0];
            var context = palette.getContext("2d");
            
            var width = Math.floor(($(palette).width() - 1) / 7 - 1);
            var height = Math.floor(($(palette).height() - 1) / 36 - 1);

            var offsetX = $event.pageX - $(palette).offset().left;
            var offsetY = $event.pageY - $(palette).offset().top;

            var x = Math.floor(offsetX / (width + 1));
            var y = Math.floor(offsetY / (height + 1));

            $scope.color = $scope.colors[y * 7 + x];
            
            $("#color").css("backgroundColor", "#" + $scope.color);
        };

        $scope.drawing = false;

        $scope.startDrawing = function($event){
            $scope.drawing = true;
        };

        $scope.stopDrawing = function($event){
            $scope.drawing = false;
        };

        $scope.drag = function($event){
            if($scope.drawing && $scope.mode == "brush"){
                $scope.draw($event);
            }
        };

        $scope.click = function($event){
            if($scope.mode == "brush"){
                $scope.stopDrawing($event);
                $scope.draw($event);
            }

            if($scope.mode == "fill"){
                var canvas = $("#grid")[0];
                var context = canvas.getContext("2d");
                
                var size = $scope.width > $scope.height ? $(canvas).width() / width : $(canvas).height() / $scope.height;
                var x = Math.floor($event.offsetX / size);
                var y = Math.floor($event.offsetY / size);
                
                $scope.fill($event, x, y);
                $scope.renderGrid($event);
            }
        };

        $scope.draw = function($event){
            var canvas = $("#grid")[0];
            var context = canvas.getContext("2d");

            var size = $scope.width > $scope.height ? $(canvas).width() / width : $(canvas).height() / $scope.height;
            var x = Math.floor($event.offsetX / size);
            var y = Math.floor($event.offsetY / size);

            $scope.data[x + "x" + y] = $scope.color;
            $scope.renderGrid($event);
        };

        $scope.fill = function($event, x, y){
            var oldColor = $scope.data[x + "x" + y] || $scope.clearColor;
            if(oldColor == $.color) return;

            var stack = [[x, y]];
            
            while(stack.length){

                var cell = stack.pop();
                var x = cell[0];
                var y = cell[1];

                $scope.data[x + "x" + y] = $scope.color;
                
                if(x - 1 >= 0 && oldColor == ($scope.data[(x - 1) + "x" + y] || "ffffff"))
                    stack.push([x - 1, y]);

                if(x + 1 < $scope.width && oldColor == ($scope.data[(x + 1) + "x" + y] || "ffffff"))
                    stack.push([x + 1, y]);

                if(y - 1 >= 0 && oldColor == ($scope.data[x + "x" + (y - 1)] || "ffffff"))
                    stack.push([x, y - 1]);

                if(y + 1 < $scope.height && oldColor == ($scope.data[x + "x" + (y + 1)] || "ffffff"))
                    stack.push([x, y + 1]);    
            }
        };

        $scope.renderGrid = function($event){
            var canvas = $(e.data.scope.options.els.grid)[0];
            var context = canvas.getContext("2d");
            
            var align = e.data.scope.align;
            
            var width = parseInt($(e.data.scope.options.els.width).val());
            var height = parseInt($(e.data.scope.options.els.height).val());
            var size = width > height ? $(canvas).width() / width : $(canvas).height() / height;
            
            if(align)
                size = width > height ? size - size / width / 2 : size - size / height / 2;
            
            var horizontalOffset = align == 1 ? size / 2 : 0;
            var verticalOffset = align == 2 ? size / 2 : 0;
            
            canvas.width = canvas.width; // Clear canvas
            
            for(var x = 0; x < width; x ++){
            
                for(var y = 0; y < height; y ++){
                
                    context.beginPath();
                    context.arc(x * size + size / 2 + (y % 2 ? horizontalOffset : 0), y * size + size / 2 + (x % 2 ? verticalOffset : 0), size / 2 - 1, 0, 2 * Math.PI, false);
                    context.fillStyle = e.data.scope.data[x+"x"+y] || e.data.scope.options.clearColor;
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = "#ddd";
                    context.stroke();
                
                }
            
            }
        };

/*
 
        // Bind events

        $(this.options.els.save).bind("click", {scope: this}, this.savePattern);
        
        $(this.options.els.width).bind("change", {scope: this}, this.renderGrid);
        $(this.options.els.height).bind("change", {scope: this}, this.renderGrid);
      
        $(this.options.els.grid).bind("mousemove", {scope: this}, this.drag);
        $(this.options.els.grid).bind("mousedown", {scope: this}, this.startDrawing);
        $(this.options.els.grid).bind("mouseup", {scope: this}, this.click);
        $(this.options.els.grid).bind("mouseleave", {scope: this}, this.stopDrawing);
        
        $(this.options.els.brush).bind("click", {scope: this}, this.setBrush);
        $(this.options.els.fill).bind("click", {scope: this}, this.setFill);
        
        $(this.options.els.alignNormal).bind("click", {scope: this}, function(e){ e.data.scope.setAlign(e, 0); });
        $(this.options.els.alignHorizontal).bind("click", {scope: this}, function(e){ e.data.scope.setAlign(e, 1); });
        $(this.options.els.alignVertical).bind("click", {scope: this}, function(e){ e.data.scope.setAlign(e, 2); });
        
        $(this.options.els.palette).bind("click", {scope: this}, this.selectColor);
        
        // Set default UI states
        
        $(this.options.els.brush).click();
        $(this.options.els.alignNormal).click();
        
        // Set starting color
        this.color = this.options.defaultColor;
        $(this.options.els.color).css("backgroundColor", "#" + this.options.defaultColor);
        
        // Render stuff
        
        this.renderGrid({data: {scope: this}});
        this.renderPalette({data: {scope: this}});
    };

    Beader.prototype.options = {
        els: {
            "save": null,
            "width": null,
            "height": null,
            "name": null,
            "alignNormal": null,
            "alignHorizontal": null,
            "alignVertical": null,
            "brush": null,
            "fill": null,
            "grid": null,
            "palette": null,
            "color": null
        },
        defaultColor: "000000",
        clearColor: "ffffff",
        saveURL: "",
        csrfToken: ""
    };

    Beader.prototype.mode = 0; // Single bead mode, 1 = fill mode
    Beader.prototype.align = 0; // 0 = normal, 1 = horizontal, 2 = vertical
    Beader.prototype.data = {};
    Beader.prototype.color = Beader.prototype.defaultColor;

    Beader.prototype.colors = ["000000","002000","003400","006700","009b00","00ce00","00ff00","070707","000035","003333","006731","009b2c","00ce23","00ff10","0e0e0e","000068","003268","006667","009a64","00ce62","00ff5d","151515","00009c","002f9c","00659b","009a9a","00cd98","00ff95","1c1c1c","0000d0","0029cf","0063cf","0099cf","00cccd","00ffcc","232323","0000ff","0021ff","0060ff","0096ff","00cbff","00ffff","2a2a2a","340000","333300","316700","2d9a00","26ce00","1bff00","313131","340034","333333","316731","2d9a2b","26ce22","1aff0f","383838","330068","333268","306666","2d9a64","26ce61","1aff5c","3f3f3f","32009b","332f9c","30649a","2d999a","25cd98","19ff96","464646","3300d0","3129cf","3063cf","2c99cf","24cccd","17ffcb","4d4d4d","3100ff","3021ff","2e60ff","2a96ff","23cbff","15ffff","545454","670000","673300","676700","649a00","62ce00","5fff00","5b5b5b","670033","673332","666730","659a2a","62ce21","5eff0b","626262","670068","673167","666666","649a64","61cd60","5eff5c","696969","67009c","672e9c","66659b","64999a","61cd97","5eff95","707070","6600cf","6729d0","6663cf","6498ce","62cdcd","5dffcb","777777","6700ff","6621ff","655fff","6497ff","61cbff","5dffff","7e7e7e","9b0000","9a3200","9a6700","999a00","98ce00","96ff00","858585","9a0031","9b3230","9a672e","999a28","98ce1e","96ff05","8c8c8c","9b0067","9a3066","9a6665","999a64","97cd60","95ff5b","939393","9b009b","9a2d9a","9a659a","999999","98cd97","95ff94","9a9a9a","9a00cf","9a28cf","9a63cf","9897cd","97cccc","95ffcb","a1a1a1","9a00ff","9a1fff","995fff","9997ff","97cbff","95ffff","a8a8a8","cf0000","cf3200","ce6600","cd9a00","cdce00","cbff00","afafaf","cf002e","ce312d","ce662a","cd9a24","cccd19","cbff00","b6b6b6","ce0065","ce3065","cd6563","cd9962","cccd5e","cbff5a","bdbdbd","ce009a","ce2d9a","cd6499","cd9998","cccc96","cbff94","c4c4c4","ce00cf","ce27ce","ce62ce","cd97cd","cccccc","cbffcb","cbcbcb","ce00ff","ce1eff","cd5fff","cd96ff","cccbff","caffff","d2d2d2","ff0000","ff3000","ff6600","ff9a00","ffce00","ffff00","d9d9d9","ff002a","ff3028","ff6525","ff991e","ffcd0f","ffff00","e0e0e0","ff0064","ff2e64","ff6563","ff9960","ffcd5d","ffff58","e7e7e7","ff0099","ff2b99","ff6398","ff9998","ffcd96","ffff92","eeeeee","ff00ce","ff25ce","ff61cd","ff98cd","ffcccb","ffffc9","f5f5f5","ff00ff","ff1cff","ff5eff","ff96ff","ffcbff","ffffff"];

    Beader.prototype.renderGrid = function(e){
        var canvas = $(e.data.scope.options.els.grid)[0];
        var context = canvas.getContext("2d");
        
        var align = e.data.scope.align;
        
        var width = parseInt($(e.data.scope.options.els.width).val());
        var height = parseInt($(e.data.scope.options.els.height).val());
        var size = width > height ? $(canvas).width() / width : $(canvas).height() / height;
        
        if(align)
            size = width > height ? size - size / width / 2 : size - size / height / 2;
        
        var horizontalOffset = align == 1 ? size / 2 : 0;
        var verticalOffset = align == 2 ? size / 2 : 0;
        
        canvas.width = canvas.width; // Clear canvas
        
        for(var x = 0; x < width; x ++){
        
            for(var y = 0; y < height; y ++){
            
                context.beginPath();
                context.arc(x * size + size / 2 + (y % 2 ? horizontalOffset : 0), y * size + size / 2 + (x % 2 ? verticalOffset : 0), size / 2 - 1, 0, 2 * Math.PI, false);
                context.fillStyle = e.data.scope.data[x+"x"+y] || e.data.scope.options.clearColor;
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = "#ddd";
                context.stroke();
            
            }
        
        }
    }

    Beader.prototype.renderPalette = function(e){
        var palette = $(e.data.scope.options.els.palette)[0];
        var context = palette.getContext("2d");
        
        var width = ($(e.data.scope.options.els.palette).width() - 1) / 7 - 1;
        var height = ($(e.data.scope.options.els.palette).height() - 1) / 36 - 1;
        
        for(var y = 0; y < 36; y++){
        
            for(var x = 0; x < 7; x++){
                
                context.beginPath();
                context.fillStyle = "#" + e.data.scope.colors[y * 7 + x];
                context.fillRect(x * (width + 1), y * (height + 1), width, height);
                context.strokeStyle = "#ffffff";
                context.lineWidth = 1;
                context.stroke();
            
            }
        
        }
    }

    Beader.prototype.setBrush = function(e){
        e.data.scope.mode = 0;
        $(e.data.scope.options.els.brush).addClass("active");
        $(e.data.scope.options.els.fill).removeClass("active");
    }

    Beader.prototype.setFill = function(e){
        e.data.scope.mode = 1;
        $(e.data.scope.options.els.fill).addClass("active");
        $(e.data.scope.options.els.brush).removeClass("active");
    }

    Beader.prototype.setAlign = function(e, align){
        
        e.data.scope.align = align;
        
        $(e.data.scope.options.els.alignNormal).removeClass("active");
        $(e.data.scope.options.els.alignHorizontal).removeClass("active");
        $(e.data.scope.options.els.alignVertical).removeClass("active");
        
        $(e.data.scope.options.els[align == 0 ? "alignNormal" : align == 1 ? "alignHorizontal" : "alignVertial"]).addClass("active");
        
        e.data.scope.renderGrid(e);

    }



    Beader.prototype.savePattern = function(e){

        var canvas = $(e.data.scope.options.els.grid)[0];
        var context = canvas.getContext("2d");

        var doc = {
            "name": $(e.data.scope.options.els.name).val(),
            "width": $(e.data.scope.options.els.width).val(),
            "height": $(e.data.scope.options.els.height).val(),
            "mode": e.data.scope.mode,
            "data": JSON.stringify(e.data.scope.data),
            "image": canvas.toDataURL("image/png").replace(/^data:image\/(png|jpg);base64,/i, "")
        }

        console.log("saving", doc);
        $.post(e.data.scope.options.saveURL, doc, function(data, status, jqxhr){
            console.log("saved"); // FIXME
            console.log(data);
        });
    }

 
    */
    }]);