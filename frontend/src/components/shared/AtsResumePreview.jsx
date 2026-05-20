import React from 'react';

// Section header with underline rule (Jake's Resume style)
const SectionRule = ({ title, fontSize = 9 }) => (
  <div style={{ marginBottom: '2px', marginTop: '6px' }}>
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        fontSize: `${fontSize}pt`,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
      }}
    >
      {title}
    </div>
    <hr style={{ border: 'none', borderTop: '0.8px solid #111', margin: '2px 0 4px 0' }} />
  </div>
);

/**
 * AtsResumePreview
 *
 * Props:
 *  - resumeData  {object}  Parsed ATS resume JSON
 *  - baseFontSize {number} Base font size in pt (e.g. 8.5)
 *  - innerRef    {React.Ref} forwarded ref for the resume paper div (used by print / pdf)
 */
const AtsResumePreview = ({ resumeData, baseFontSize = 8.5, innerRef }) => {
  if (!resumeData) return null;

  const c = resumeData.contact || {};
  const contactParts = [c.phone, c.email, c.linkedin, c.github, c.portfolio].filter(Boolean);

  return (
    <div
      ref={innerRef}
      className="border border-gray-200 shadow-md print:border-none print:shadow-none"
      style={{
        fontFamily: 'Lora, Georgia, serif',
        fontSize: `${baseFontSize}pt`,
        lineHeight: 1.25,
        color: '#111',
        background: '#fff',
        padding: '36px 48px',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Name */}
      <div style={{ textAlign: 'center', marginBottom: '2px' }}>
        <span
          style={{
            fontSize: `${baseFontSize * 2.1}pt`,
            fontWeight: 'bold',
            fontFamily: 'Playfair Display, Georgia, serif',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
          }}
        >
          {resumeData.name}
        </span>
      </div>

      {/* Contact */}
      {contactParts.length > 0 && (
        <div
          style={{
            textAlign: 'center',
            fontSize: `${baseFontSize - 0.5}pt`,
            fontFamily: 'Inter, sans-serif',
            color: '#444',
            marginBottom: '8px',
          }}
        >
          {contactParts.join('  |  ')}
        </div>
      )}

      {/* Summary */}
      {resumeData.summary && (
        <>
          <SectionRule title="Summary" fontSize={baseFontSize + 0.5} />
          <p style={{ fontSize: `${baseFontSize}pt`, marginBottom: '6px', textAlign: 'justify' }}>
            {resumeData.summary}
          </p>
        </>
      )}

      {/* Skills */}
      {resumeData.skills?.length > 0 && (
        <>
          <SectionRule title="Technical Skills" fontSize={baseFontSize + 0.5} />
          <div style={{ marginBottom: '6px' }}>
            {resumeData.skills.map((s, i) => (
              <div key={i} style={{ fontSize: `${baseFontSize}pt`, marginBottom: '2px' }}>
                <strong>{s.category}:</strong> {s.items}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Experience */}
      {resumeData.experience?.length > 0 && (
        <>
          <SectionRule title="Experience" fontSize={baseFontSize + 0.5} />
          {resumeData.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: `${baseFontSize}pt`,
                }}
              >
                <span>{exp.company}</span>
                <span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>
                  {exp.dates}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontStyle: 'italic',
                  fontSize: `${baseFontSize - 0.5}pt`,
                  marginBottom: '2px',
                }}
              >
                <span>{exp.role}</span>
                <span>{exp.location}</span>
              </div>
              {exp.bullets?.map((b, j) => (
                <div key={j} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>
                  • {b}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Projects */}
      {resumeData.projects?.length > 0 && (
        <>
          <SectionRule title="Projects" fontSize={baseFontSize + 0.5} />
          {resumeData.projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: '6px' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: `${baseFontSize}pt`,
                  marginBottom: '1px',
                }}
              >
                {proj.name}{' '}
                <span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>
                  — {proj.technologies}
                </span>
              </div>
              {proj.bullets?.map((b, j) => (
                <div key={j} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>
                  • {b}
                </div>
              ))}
            </div>
          ))}
        </>
      )}

      {/* Achievements */}
      {resumeData.achievements?.length > 0 && (
        <>
          <SectionRule title="Achievements" fontSize={baseFontSize + 0.5} />
          <div style={{ marginBottom: '6px' }}>
            {resumeData.achievements.map((a, i) => (
              <div key={i} style={{ fontSize: `${baseFontSize - 0.5}pt`, paddingLeft: '12px' }}>
                • {a}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {resumeData.education?.length > 0 && (
        <>
          <SectionRule title="Education" fontSize={baseFontSize + 0.5} />
          {resumeData.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  fontSize: `${baseFontSize}pt`,
                }}
              >
                <span>{edu.institution}</span>
                <span style={{ fontWeight: 'normal', fontSize: `${baseFontSize - 0.5}pt` }}>
                  {edu.dates}
                </span>
              </div>
              <div style={{ fontStyle: 'italic', fontSize: `${baseFontSize - 0.5}pt` }}>
                {edu.degree} | {edu.location}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AtsResumePreview;
