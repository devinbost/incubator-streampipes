/*
Copyright 2019 FZI Forschungszentrum Informatik

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
package org.streampipes.pe.examples.jvm.engine;

import org.streampipes.model.graph.DataProcessorDescription;
import org.streampipes.model.graph.DataProcessorInvocation;
import org.streampipes.sdk.builder.ProcessingElementBuilder;
import org.streampipes.sdk.builder.StreamRequirementsBuilder;
import org.streampipes.sdk.extractor.ProcessingElementParameterExtractor;
import org.streampipes.sdk.helpers.EpRequirements;
import org.streampipes.sdk.helpers.OutputStrategies;
import org.streampipes.wrapper.standalone.ConfiguredExternalEventProcessor;
import org.streampipes.wrapper.standalone.declarer.StandaloneExternalEventProcessingDeclarer;

public class ExampleExternalEngineController
        extends StandaloneExternalEventProcessingDeclarer<ExampleExternalEngineParameters> {

  @Override
  public DataProcessorDescription declareModel() {
    return ProcessingElementBuilder.create("org.streampipes.examples.engine.external", "Example " +
            "External Engine", "")
            .requiredStream(StreamRequirementsBuilder.
                    create()
                    .requiredProperty(EpRequirements.anyProperty())
                    .build())
            .outputStrategy(OutputStrategies.keep())
            .build();
  }

  @Override
  public ConfiguredExternalEventProcessor<ExampleExternalEngineParameters> onInvocation(DataProcessorInvocation graph, ProcessingElementParameterExtractor extractor) {
    return new ConfiguredExternalEventProcessor<>(new ExampleExternalEngineParameters(graph),
            ExampleExternalEngine::new);
  }
}
