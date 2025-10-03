package mapper

// Helper functions for converting between domain and model types

// StringPtr converts a string to *string
func StringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}

// StringValue converts *string to string
func StringValue(s *string) string {
	if s == nil {
		return ""
	}
	return *s
}
