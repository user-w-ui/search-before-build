from .validate_github import validate as validate_github
from .validate_package import validate as validate_package
from .validate_report import validate as validate_report
from .validate_skills import validate as validate_skills


VALIDATORS = {
    "package": validate_package,
    "skills": validate_skills,
    "github": validate_github,
    "report": validate_report,
}
