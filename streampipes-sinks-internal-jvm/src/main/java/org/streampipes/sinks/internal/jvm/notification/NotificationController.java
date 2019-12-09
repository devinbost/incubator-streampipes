/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.streampipes.sinks.internal.jvm.notification;

import org.streampipes.model.DataSinkType;
import org.streampipes.model.graph.DataSinkDescription;
import org.streampipes.model.graph.DataSinkInvocation;
import org.streampipes.sdk.builder.DataSinkBuilder;
import org.streampipes.sdk.builder.StreamRequirementsBuilder;
import org.streampipes.sdk.extractor.DataSinkParameterExtractor;
import org.streampipes.sdk.helpers.EpRequirements;
import org.streampipes.sdk.helpers.Labels;
import org.streampipes.sdk.helpers.Locales;
import org.streampipes.sdk.utils.Assets;
import org.streampipes.wrapper.standalone.ConfiguredEventSink;
import org.streampipes.wrapper.standalone.declarer.StandaloneEventSinkDeclarer;

public class NotificationController extends StandaloneEventSinkDeclarer<NotificationParameters> {

  private static final String TITLE_KEY = "title";
  private static final String CONTENT_KEY = "content";

  @Override
  public DataSinkDescription declareModel() {
    return DataSinkBuilder.create("org.streampipes.sinks.internal.jvm.notification")
            .withLocales(Locales.EN)
            .withAssets(Assets.DOCUMENTATION, Assets.ICON)
            .category(DataSinkType.NOTIFICATION)
            .requiredStream(StreamRequirementsBuilder
                    .create()
                    .requiredProperty(EpRequirements.anyProperty())
                    .build())
            .requiredTextParameter(Labels.withId(TITLE_KEY))
            .requiredHtmlInputParameter(Labels.withId(CONTENT_KEY))
            .build();
  }

  @Override
  public ConfiguredEventSink<NotificationParameters> onInvocation(DataSinkInvocation graph,
                                                                  DataSinkParameterExtractor extractor) {

    String title = extractor.singleValueParameter(TITLE_KEY, String.class);
    String content = extractor.singleValueParameter(CONTENT_KEY, String.class);

    NotificationParameters params = new NotificationParameters(graph, title, content);

    return new ConfiguredEventSink<>(params, NotificationProducer::new);
  }

}
