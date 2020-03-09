/*
 *   Licensed to the Apache Software Foundation (ASF) under one or more
 *   contributor license agreements.  See the NOTICE file distributed with
 *   this work for additional information regarding copyright ownership.
 *   The ASF licenses this file to You under the Apache License, Version 2.0
 *   (the "License"); you may not use this file except in compliance with
 *   the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

import {Component, OnDestroy, OnInit} from "@angular/core";
import {RxStompService} from "@stomp/ng2-stompjs";
import {BaseStreamPipesWidget} from "../base/base-widget";
import {StaticPropertyExtractor} from "../../../sdk/extractor/static-property-extractor";
import {ResizeService} from "../../../services/resize.service";

@Component({
    selector: 'raw-widget',
    templateUrl: './raw-widget.component.html',
    styleUrls: ['./raw-widget.component.css']
})
export class RawWidgetComponent extends BaseStreamPipesWidget implements OnInit, OnDestroy {

    items: Array<string>;
    width: number;
    height: number;

    constructor(rxStompService: RxStompService, resizeService: ResizeService) {
        super(rxStompService, resizeService, false);
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.width = this.computeCurrentWidth(this.gridsterItemComponent);
        this.height = this.computeCurrentHeight(this.gridsterItemComponent);
        this.items = [];
    }

    ngOnDestroy(): void {
        super.ngOnDestroy();
    }

    extractConfig(extractor: StaticPropertyExtractor) {

    }


    protected onEvent(event: any) {
        this.items.unshift(JSON.stringify(event));
        if (this.items.length > 5) {
            this.items.pop();
        }
    }

    protected onSizeChanged(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

}