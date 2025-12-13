import { ResumeData, LayoutSettings } from '../../types';

interface ResumePreviewProps {
    resumeData: ResumeData;
    layoutSettings: LayoutSettings;
}

export const ResumePreview = ({ resumeData, layoutSettings }: ResumePreviewProps) => {
    return (
        <div className="resume-content" style={{
            fontFamily: layoutSettings.fontFamily,
            height: '10.7in',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%',
        }}>
            {/* Header */}
            <div className="mb-3" style={{
                textAlign: 'center',
                paddingBottom: '10pt',
                marginBottom: '10pt'
            }}>
                <h1 className="mb-0" style={{
                    fontSize: '24pt',
                    fontWeight: 'normal',
                    letterSpacing: '0.02em',
                }}>
                    {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
                </h1>
                {resumeData.personalInfo.targetJobTitle && (
                    <p style={{
                        fontSize: '14pt',
                        fontWeight: 'normal',
                        marginBottom: '2pt'
                    }}>
                        {resumeData.personalInfo.targetJobTitle}
                    </p>
                )}

                {/* Social Links on separate line */}
                {(resumeData.personalInfo.githubUrl || resumeData.personalInfo.linkedinUrl) && (
                    <div style={{
                        fontSize: '10pt',
                        fontWeight: 'normal',
                    }}>
                        {resumeData.personalInfo.githubUrl && (
                            <span>
                                <a href={resumeData.personalInfo.githubUrl} target='_blank' style={{ color: 'rgb(0, 51, 153)', textDecoration: 'none' }}>
                                    Github: {resumeData.personalInfo.githubUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                                </a>
                                {resumeData.personalInfo.linkedinUrl && ' | '}
                            </span>
                        )}
                        {resumeData.personalInfo.linkedinUrl && (
                            <a href={resumeData.personalInfo.linkedinUrl} target='_blank' style={{ color: 'rgb(0, 51, 153)', textDecoration: 'none' }}>
                                LinkedIn: {resumeData.personalInfo.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                            </a>
                        )}
                    </div>
                )}

                {/* Contact info on next line */}
                <div style={{
                    fontSize: '10pt',
                    fontWeight: 'normal',
                    color: 'rgb(0, 51, 153)',
                }}>
                    {resumeData.personalInfo.email && (
                        <span>{resumeData.personalInfo.email}</span>
                    )}
                    {resumeData.personalInfo.email && resumeData.personalInfo.phone && ' | '}
                    {resumeData.personalInfo.phone && (
                        <span>{resumeData.personalInfo.phone}</span>
                    )}
                    {(resumeData.personalInfo.email || resumeData.personalInfo.phone) && resumeData.personalInfo.location && ' | '}
                    {resumeData.personalInfo.location && (
                        <span>{resumeData.personalInfo.location}</span>
                    )}
                </div>
            </div>

            {/* Summary */}
            {resumeData.summary && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Summary
                    </h2>
                    <p style={{
                        textAlign: 'justify',
                        fontSize: '10pt',
                        lineHeight: '1.3',
                        fontWeight: 'normal',
                        marginTop: '6pt',
                        marginBottom: '0'
                    }}>
                        {resumeData.summary}
                    </p>
                </div>
            )}

            {/* Skills */}
            {resumeData.skills.categories.length > 0 && (() => {
                const longestCategory = Math.max(
                    ...resumeData.skills.categories.map(cat => cat.name.length)
                );
                const labelWidth = `${longestCategory * 7 + 10}pt`;

                return (
                    <div style={{ marginBottom: '10pt' }}>
                        <h2 style={{
                            fontSize: '14.4pt',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            fontWeight: 'normal',
                            marginBottom: '0',
                            paddingBottom: '1pt',
                            borderBottom: '0.4pt solid black',
                            marginTop: '10pt'
                        }}>
                            Skills
                        </h2>
                        <div style={{ fontSize: '10pt', marginTop: '6pt' }}>
                            {resumeData.skills.categories.map((category) => (
                                <div key={category.id} style={{
                                    marginBottom: '2px',
                                    display: 'flex'
                                }}>
                                    <span style={{
                                        fontWeight: 'normal',
                                        minWidth: labelWidth,
                                        display: 'inline-block'
                                    }}>
                                        {category.name}:
                                    </span>
                                    <span style={{
                                        fontWeight: 'normal',
                                        flex: 1
                                    }}>
                                        {category.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Experience */}
            {resumeData.experience.length > 0 && (() => {
                // Filter out empty experiences
                const validExperiences = resumeData.experience.filter(exp =>
                    exp.position.trim() ||
                    exp.company.trim() ||
                    exp.achievements.some(a => a.trim())
                );

                // Only render if there are valid experiences
                if (validExperiences.length === 0) return null;

                return (
                    <div style={{ marginBottom: '10pt' }}>
                        <h2 style={{
                            fontSize: '14.4pt',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            fontWeight: 'normal',
                            marginBottom: '0',
                            paddingBottom: '1pt',
                            borderBottom: '0.4pt solid black',
                            marginTop: '10pt'
                        }}>
                            Experience
                        </h2>
                        <div style={{ marginTop: '6pt' }}>
                            {validExperiences.map((exp) => (
                                <div key={exp.id} style={{
                                    marginBottom: '9pt',
                                    fontWeight: 'normal'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        marginBottom: '6pt',
                                        marginTop: '10pt'
                                    }}>
                                        <div style={{
                                            fontSize: '12pt',
                                            fontWeight: 'normal'
                                        }}>
                                            <span style={{ fontWeight: 'bold' }}>{exp.position}</span>

                                            {exp.company && (
                                                <>
                                                    <span> at </span>
                                                    <span style={{ fontWeight: 'bold' }}>{exp.company}</span>
                                                </>
                                            )}

                                            {exp.location && (
                                                <span style={{ marginLeft: '4pt' }}>
                                                    ({exp.location})
                                                </span>
                                            )}
                                        </div>
                                        <span style={{
                                            fontSize: '12pt',
                                            fontWeight: 'normal'
                                        }}>
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    {exp.achievements.length > 0 && exp.achievements[0] && (
                                        <ul style={{
                                            fontSize: '10pt',
                                            marginTop: '2pt',
                                            marginBottom: '0',
                                            marginLeft: '1em',
                                            paddingLeft: '0',
                                            listStyleType: 'none',
                                            fontWeight: 'normal'
                                        }}>
                                            {exp.achievements.map((achievement, index) => (
                                                achievement && <li key={index} style={{
                                                    lineHeight: '1.3',
                                                    marginBottom: '3pt',
                                                    position: 'relative',
                                                    paddingLeft: '1.2em'
                                                }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        left: '0'
                                                    }}>•</span>
                                                    {achievement}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Projects */}
            {resumeData.projects.length > 0 && (() => {
                // Filter out empty projects
                const validProjects = resumeData.projects.filter(project =>
                    project.title.trim() ||
                    project.technologies.trim() ||
                    project.description.some(d => d.trim())
                );

                // Only render if there are valid projects
                if (validProjects.length === 0) return null;

                return (
                    <div style={{ marginBottom: '10pt' }}>
                        <h2 style={{
                            fontSize: '14.4pt',
                            textTransform: 'uppercase',
                            textAlign: 'left',
                            fontWeight: 'normal',
                            marginBottom: '0',
                            paddingBottom: '1pt',
                            borderBottom: '0.4pt solid black',
                            marginTop: '10pt'
                        }}>
                            Projects
                        </h2>
                        <div style={{ marginTop: '6pt' }}>
                            {validProjects.map((project) => (
                                <div key={project.id} style={{
                                    marginBottom: '9pt',
                                    fontWeight: 'normal'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'baseline',
                                        marginBottom: '2pt'
                                    }}>
                                        <h3 style={{
                                            fontSize: '12pt',
                                            fontWeight: 'bold',
                                            margin: '0'
                                        }}>
                                            {project.title}
                                        </h3>
                                        {project.link && (
                                            <a href={project.link} target='_blank' style={{
                                                color: 'rgb(0, 51, 153)',
                                                textDecoration: 'none',
                                                fontSize: '12pt',
                                                fontWeight: 'normal'
                                            }}>
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                    {project.technologies && (
                                        <p style={{
                                            fontSize: '9pt',
                                            fontStyle: 'italic',
                                            marginBottom: '2pt',
                                            marginTop: '0',
                                            fontWeight: 'normal'
                                        }}>
                                            Tech Stack: {project.technologies}
                                        </p>
                                    )}
                                    {project.description.length > 0 && project.description[0] && (
                                        <ul style={{
                                            fontSize: '10pt',
                                            marginTop: '2pt',
                                            marginBottom: '0',
                                            marginLeft: '1em',
                                            paddingLeft: '0',
                                            listStyleType: 'none',
                                            fontWeight: 'normal'
                                        }}>
                                            {project.description.map((desc, index) => (
                                                desc && <li key={index} style={{
                                                    lineHeight: '1.3',
                                                    marginBottom: '3pt',
                                                    position: 'relative',
                                                    paddingLeft: '1.2em'
                                                }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        left: '0'
                                                    }}>•</span>
                                                    {desc}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* Education */}
            {resumeData.education.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Education</h2>
                    <div style={{
                        fontSize: '11pt',
                        marginTop: '6pt',
                        fontWeight: 'normal'
                    }}>
                        {resumeData.education.map((edu) => (
                            <div key={edu.id} style={{
                                marginBottom: '6pt',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline'
                            }}>
                                <div>
                                    <span style={{ fontWeight: 'normal', marginLeft: '1em' }}>
                                        {edu.degree} in{' '}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {edu.field}
                                    </span>
                                    <span style={{ fontWeight: 'normal' }}>
                                        {' '}at{' '}
                                    </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {edu.institution}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '1em', whiteSpace: 'nowrap' }}>
                                    {edu.gpa && (
                                        <span style={{ fontWeight: 'normal' }}>
                                            (GPA: {edu.gpa})
                                        </span>
                                    )}
                                    <span style={{ fontWeight: 'normal' }}>
                                        {edu.startDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications & Achievements */}
            {resumeData.certifications.length > 0 && (
                <div style={{ marginBottom: '10pt' }}>
                    <h2 style={{
                        fontSize: '14.4pt',
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        fontWeight: 'normal',
                        marginBottom: '0',
                        paddingBottom: '1pt',
                        borderBottom: '0.4pt solid black',
                        marginTop: '10pt'
                    }}>
                        Certifications & Achievements
                    </h2>
                    <ul style={{
                        fontSize: '10pt',
                        marginTop: '6pt',
                        marginBottom: '0',
                        marginLeft: '1em',
                        paddingLeft: '0',
                        listStyleType: 'none',
                        fontWeight: 'normal'
                    }}>
                        {resumeData.certifications.map((cert) => (
                            <li key={cert.id} style={{
                                lineHeight: '1.3',
                                marginBottom: '3pt',
                                position: 'relative',
                                paddingLeft: '1.2em',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'baseline'
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '0'
                                }}>•</span>
                                <span>
                                    {cert.name}
                                    {cert.issuer && ` – ${cert.issuer}`}
                                    {cert.date && ` (${cert.date})`}
                                </span>
                                {cert.link && (
                                    <a href={cert.link} target='_blank' style={{
                                        color: 'rgb(0, 51, 153)',
                                        textDecoration: 'none',
                                        marginLeft: '1em',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        View Credential
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};