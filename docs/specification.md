# Specification

## Abstract

This specification defines the functional and technical requirements for the Data Quality Checker Service (DQCS), within
the EOSC EDEN ecosystem. The DQCS is responsible for analysing ingested data and performing periodic quality assessments
checks, according to a predefined set of data quality indicators (provided by WP1). By standardising indicators and metrics, the service
enables Trusted Digital Archives (TDA) or repositories (TDR) to; monitor data quality; support decisions regarding
long-term preservation and reuse; and ensure consistency and interoperability of research data over time.

![img.png](assets/dqcs_overview.png)

Fig. 1. Overview of how the DQCS Portal connects and works with TDAs or TDRs.

## Status of This Document

This document is a publication ready specification. The service may evolve with further developments, any changes will
be clearly documented in future revisions of this specification.

## Description

The DQCS is a system designed to support the management and checking of data quality within TDAs or TDRs. Unlike simple
one-off checks, the DQCS is organised as a two-tiered system, enabling consistent quality checking across multiple
repositories and domains.

- DQCS Portal[1.1]: A web app that can call data quality checks in multiple TDAs/TDRs and collect results in a
  standardised format, either periodically or on demand.
- TDA Assessment Module (TDA Module): This module sits in a TDA/TDR, measures data quality requirements, and returns
  results as data quality indicators to the DQCS Portal. The TDA Module implements the measurements using the methods of
  the hosting TDA/TDR (which can be domain-specific), while ensuring that the results remain comparable across different
  TDAs/TDRs.

This approach ensures both standardisation and comparability of results, and domain-specific flexibility, allowing each
TDA/TDR to adapt assessments to its own data and context. In addition, this architecture makes it a federated service
that can be used by multiple EOSC nodes and TDAs/TDRs.

Scope
In Scope:

- Data quality metrics: TDAs/TDRs performing data quality assessments based on the predefined measurements, core
  dimensions and, where applicable, additional domain-specific dimensions
- DQCS Portal: Calls a TDA/TDR to request indicator results in a standardised format. Assessments may be run manually or
  periodically.
- Domain-specific quality checks: Allows TDAs/TDRs to define and measure their own quality requirements, while
  maintaining a common reporting format. Results reporting: Display indicator results to the user, via the DQCS Portal.

Out of Scope:

- Assessment lifecycle management: Current version of the tool does not support triggering or managing assessment runs
  from the DQCS Portal, including cancellation of in-progress assessments. Full assessment lifecycle management (
  including asynchronous assessment runs), status polling, and cancellation can be considered as a future extension (see
  Possible Extension section, item 5).
- Data access and storage: The DQCS Portal does not have direct access to the data content. The module responsible for
  measurement performs all assessments locally within each TDA/TDR.
- Data transformation or remediation: The service does not modify, migrate, nor transform data; it only collects and
  presents data quality.
- While domain-specific dimensions may be included, the service does not enforce or validate them beyond collecting
  results in a standardised format.
- Data characterisation: Extracting metadata (e.g., image resolution, measurement units) is out of scope unless it
  directly impacts the assessment.

## Core Preservation Processes

The data quality assessment processes define the required inputs and expected outputs for successful execution. For
CPP-019 – Data Quality Assessment, the expected input consists of data objects that need to be evaluated for quality.
The expected output includes, among others:
Technical metadata:

- Identifiers of quality indicators
- Indication of which indicators were used in the assessment

Process metadata:

- Date and time of the assessment
- Assessment result

The assessment process may be performed on a regular basis within the TDA/TDR by the DQCS. Typical high-level steps
include:

1. Define the scope of the assessment.
2. Specify quality indicators and metrics
3. Collect and analyse data.
4. Generate the quality report.

The process may be repeated on a regular basis to monitor potential degradation of quality over time.

## Possible Extensions

The following list presents possible extensions to DQCS core functionality:
1. Measure data quality on different levels of granularity, for example, a section of the data, data from the last 5
   years, or a single digital object.
2. Store received results in the DQCS Portal so that results are cached and to facilitate faster answers to user
   requests.
3. Create an admin user interface where profiles for TDAs/TDRs can be added, removed, and edited.
4. OpenAPI specification serves as the single source of truth (also machine readable) for formally describing REST API’s
   endpoints, request and response structures and error contracts.
5. Allow upload of a digital object and a metric profile to the DQCS Portal, and run the assessment there.This would
   mean that no calls to TDAs/TDRs would be needed.
6. Allow the DQCS Portal to run data quality assessments on a TDA/TDR. If the assessment would take some time, an
   appropriate approach is needed. An example overview of how "Assessment Lifecycle" could work:
    1. DQCS Portal generates a UUID to be used as assessment_run_id and calls API endpoint on /v1/assess (including the
       UUID in the request body).
    2. API responds with 202 Accepted and begins assessment work asynchronously.
    3. DQCS Portal polls API on /v1/assess/{assessment_run_id} at a fixed time interval (can be replaced with
       exponential back-off mechanism)
    4. Whilst assessment is ongoing, API is to respond with the appropriate response.
    5. When the TDA/TDR completes the assessment, the response returns the full set of indicator scores, DQCS Portal marks
       the run as done, and does not poll further.
    6. If the TDA/TDR reports a failure in data quality assessment or becomes unreachable for any reason, DQCS Portal marks
       the run as failed and does not poll further.
7. Allow TDAs/TDRs to select which data quality metrics they want to return. At the moment, every metric/indicator can
   stay as optional, but in the future this could be configurable on a per TDA/TDR basis.
8. Custom indicators are considered to be an edge case, therefore DQCS Portal will not support custom indicators and it
   will be possible to extend the functionality at a later date.
9. Side-by-side comparison of data quality results between two check. It has been identified that it is not required to
   have this feature, but we are making a note of it here for future purposes.

## Conformance

The keywords MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY are to be interpreted as described in RFC
2119 (https://www.rfc-editor.org/rfc/rfc2119).

## Normative Requirements

- QUALITY-TECHNICAL-REQ-108 – The service SHOULD be a continuous process for assessing the data quality (e.g. fixity
  checks)
- QUALITY-TECHNICAL-REQ-002 – The TDA MUST be able to support periodic checking of data quality indicators.
- DISCIPLINE-SPECIFIC-REQ-040 - As a producer and consumer, I need to interact with repositories regarding requirements
  for reappraisal.

## Non-normative Guidance

**DQCS Portal implementation considerations:**

- An independent web service operating above the connected TDAs/TDRs.
- The service does not perform measurements itself, it triggers assessment processes in connected TDAs/TDRs and collects
  the results.
- The service knows the endpoint required to trigger an assessment for each of the connected TDAs/TDRs.
- A TDA/TDR provides an authorization token that enables the DQCS Portal to securely call REST endpoints exposed by the
  TDA/TDR.
- Optionally, the DQCS Portal may validate the indicator results returned from the TDA, for example, whether all
  required core indicators are present in the collected results.
- All endpoints require authorization and are versioned using a URL path convention, (such as the /v1/... prefix) to
  ensure backwards compatibility and consistent API access.

## Expected API Endpoints
| Method | Path                       | Purpose                                                    |
|--------|----------------------------|------------------------------------------------------------|
| GET    | `/v1/health`               | Verify the TDA/repository is reachable.                    |
| GET    | `/v1/data-quality-results` | Retrieve data quality results provided by the TDA Module.  |

### Example of assess response body coming from a TDA/repository:
```aiignore
{
	"assessment_run_id": "01900a78-3c12-7000-8b3e-2a0e4c5b1f9d",
	"tda_id": "tda-demo",
	"digital_object": {
		"id": "spec-demo-2026",
		"type": "dataset"
	},
	"completed_at": "2026-09-30T10:00:00Z",
	"indicators": [
		{
			"indicator_id": "CDQ-001",
			"score": 94,
			"metadata": {
				"sample_size": 1000,
				// other metadata specific to this indicator...
			}
		},
		{
			"indicator_id": "CDQ-005",
			"score": 88
		},
		// further indicators can be listered here...
	],
	"metadata": [
		{
			"note": "Public records only"
			// ... further overall assesment metadata can be listed here
		}
	]
}
```

## References
1. EOSC Interoperability Framework: Guidelines for semantic and technical interoperability in the European Open Science Cloud.
2. IETF RFC 2119: Key words for use in RFCs to indicate requirement levels.
3. [CPP-019 Data Quality Assessment](https://github.com/EOSC-EDEN/wp1-cpp-descriptions/blob/main/CPP-019/EOSC-EDEN_CPP-019_Data_Quality_Assessment.pdf)
